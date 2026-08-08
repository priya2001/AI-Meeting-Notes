import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { meetings } from "@/lib/db/schema";
import { parseBullets } from "@/lib/meeting-notes";
import { syncCurrentUser } from "@/lib/users";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  const db = getDb();

  if (!db) {
    return NextResponse.json({ meetings: [], setupNeeded: true });
  }

  try {
    const userRecord = await syncCurrentUser(userId);

    if (!userRecord) {
      return NextResponse.json({ meetings: [], setupNeeded: true });
    }

    const rows = await db.select().from(meetings).where(eq(meetings.userId, userRecord.id)).orderBy(desc(meetings.createdAt)).limit(12);

    return NextResponse.json({
      meetings: rows.map((row) => ({
        id: row.id,
        title: row.title,
        summary: row.summary,
        actionItems: parseBullets(row.actionItems),
        decisions: parseBullets(row.decisions),
        nextSteps: parseBullets(row.nextSteps),
        transcript: row.transcript,
        createdAt: row.createdAt.toISOString()
      })),
      setupNeeded: false
    });
  } catch {
    return NextResponse.json({ meetings: [], setupNeeded: true });
  }
}
