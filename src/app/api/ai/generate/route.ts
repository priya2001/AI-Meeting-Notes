import OpenAI from "openai";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db";
import { meetings } from "@/lib/db/schema";
import { env, llmApiKey } from "@/lib/env";
import {
  formatBullets,
  meetingGenerationSchema,
  meetingNotesSchema,
  sanitizeMeetingNotes
} from "@/lib/meeting-notes";
import { syncCurrentUser } from "@/lib/users";

const openai = llmApiKey
  ? new OpenAI({
      apiKey: llmApiKey,
      baseURL: env.GROQ_API_KEY || env.Groq_API_KEY ? "https://api.groq.com/openai/v1" : undefined
    })
  : null;

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "You must be signed in to generate meeting notes." }, { status: 401 });
  }

  if (!openai) {
    return NextResponse.json({ error: "Set GROQ_API_KEY (or OPENAI_API_KEY) in your env file." }, { status: 503 });
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

  const completion = await openai.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content: [
          "You turn meeting transcripts into concise, practical notes.",
          "Return only valid JSON.",
          'The JSON must match this shape: {"title":"string","summary":"string","actionItems":["string"],"decisions":["string"],"nextSteps":["string"]}.',
          "Do not wrap the JSON in markdown fences."
        ].join(" ")
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
  });

  const rawContent = completion.choices[0]?.message?.content ?? "";
  const parsedJson = safeParseJson(rawContent);
  const generated = meetingNotesSchema.safeParse(parsedJson);

  if (!generated.success) {
    return NextResponse.json(
      {
        error: "The AI returned an invalid response.",
        raw: rawContent
      },
      { status: 502 }
    );
  }

  const notes = sanitizeMeetingNotes(generated.data);
  const dbClient = getDb();
  const userRecord = await syncCurrentUser(userId);

  let savedMeeting = null;

  if (dbClient && userRecord) {
    try {
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
    } catch {
      savedMeeting = null;
    }
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

function safeParseJson(value: string) {
  const trimmed = value.trim();
  const stripped = trimmed.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/, "");

  try {
    return JSON.parse(stripped);
  } catch {
    return null;
  }
}
