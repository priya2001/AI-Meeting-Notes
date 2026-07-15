import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "AI generation endpoint is not wired yet."
    },
    { status: 501 }
  );
}