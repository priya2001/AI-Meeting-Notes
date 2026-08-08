import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db";
import { meetings } from "@/lib/db/schema";
import { env } from "@/lib/env";
import {
  formatBullets,
  meetingGenerationSchema,
  meetingNotesSchema,
  sanitizeMeetingNotes
} from "@/lib/meeting-notes";
import { syncCurrentUser } from "@/lib/users";

const openai = env.OPENAI_API_KEY ? new OpenAI({ apiKey: env.OPENAI_API_KEY }) : null;

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "You must be signed in to generate meeting notes." }, { status: 401 });
  }

  if (!openai) {
    return NextResponse.json({ error: "OPENAI_API_KEY is not configured yet." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const parsedInput = meetingGenerationSchema.safeParse(body);

  if (!parsedInput.success) {
    return NextResponse.json(
      {
        error: "Please provide a meeting transcript.",
        issues: parsedInput.error.flatten()
      },
      { status: 400 }
    );
  }

  const { title, transcript } = parsedInput.data;
  const modelTitle = title ?? "Meeting transcript";

  const completion = await openai.chat.completions.parse({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You turn meeting transcripts into concise, practical notes. Return only structured JSON with a title, summary, action items, decisions, and next steps."
      },
      {
        role: "user",
        content: [
          `Meeting title hint: ${modelTitle}`,
          "Transcript:",
          transcript,
          "Write a concise summary, extract clear action items, decisions, and next steps."
        ].join("\n\n")
      }
    ],
    response_format: zodResponseFormat(meetingNotesSchema, "meeting_notes")
  });

  const generated = completion.choices[0]?.message?.parsed;

  if (!generated) {
    return NextResponse.json({ error: "The AI did not return a valid response." }, { status: 502 });
  }

  const notes = sanitizeMeetingNotes(generated);
  const dbClient = getDb();
  const userRecord = await syncCurrentUser(userId);

  let savedMeeting = null;

  if (dbClient && userRecord) {
    const [meeting] = await dbClient
      .insert(meetings)
      .values({
        userId: userRecord.id,
        title: notes.title,
        transcript,
        summary: notes.summary,
        actionItems: formatBullets(notes.actionItems),
        decisions: formatBullets(notes.decisions),
        nextSteps: formatBullets(notes.nextSteps)
      })
      .returning();

    savedMeeting = meeting ?? null;
  }

  return NextResponse.json({
    saved: Boolean(savedMeeting),
    meeting: {
      id: savedMeeting?.id ?? null,
      title: notes.title,
      summary: notes.summary,
      actionItems: notes.actionItems,
      decisions: notes.decisions,
      nextSteps: notes.nextSteps,
      transcript,
      createdAt: savedMeeting?.createdAt ?? new Date().toISOString()
    },
    setupNeeded: !dbClient
  });
}
