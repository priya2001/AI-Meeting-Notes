import { z } from "zod";

export const meetingNotesSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  actionItems: z.array(z.string().min(1)).default([]),
  decisions: z.array(z.string().min(1)).default([]),
  nextSteps: z.array(z.string().min(1)).default([])
});

export const meetingGenerationSchema = z.object({
  title: z.string().trim().min(1).max(120).optional(),
  transcript: z.string().trim().min(40, "Please add a bit more transcript so the AI has context.")
});

export type MeetingNotes = z.infer<typeof meetingNotesSchema>;
export type MeetingGenerationInput = z.infer<typeof meetingGenerationSchema>;

export function formatBullets(items: string[]) {
  if (!items.length) {
    return "None";
  }

  return items.map((item) => `• ${item}`).join("\n");
}

export function parseBullets(value: string) {
  if (!value || value.trim() === "None") {
    return [];
  }

  return value
    .split("\n")
    .map((line) => line.replace(/^•\s*/, "").trim())
    .filter(Boolean);
}

export function sanitizeMeetingNotes(notes: MeetingNotes) {
  return {
    title: notes.title.trim(),
    summary: notes.summary.trim(),
    actionItems: notes.actionItems.map((item) => item.trim()).filter(Boolean),
    decisions: notes.decisions.map((item) => item.trim()).filter(Boolean),
    nextSteps: notes.nextSteps.map((item) => item.trim()).filter(Boolean)
  };
}
