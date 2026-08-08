import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { ArrowRight, BarChart3, CheckCircle2, FilePlus2, History, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AuthMenu } from "@/components/auth-menu";
import { MeetingWorkbench, type MeetingRecord } from "@/components/meeting-workbench";
import { getDb } from "@/lib/db";
import { meetings } from "@/lib/db/schema";
import { env } from "@/lib/env";
import { parseBullets } from "@/lib/meeting-notes";
import { syncCurrentUser } from "@/lib/users";

export const dynamic = "force-dynamic";

const quickStats = [
  { label: "Notes this month", value: "0 / 3", note: "Starter plan limit later" },
  { label: "Saved meetings", value: "0", note: "Per-user history" },
  { label: "Plan status", value: "Free", note: "Upgrade in billing" }
];

const shortcuts = [
  {
    icon: FilePlus2,
    title: "Create a new note",
    description: "Paste a transcript and generate your first AI meeting summary."
  },
  {
    icon: History,
    title: "Review past meetings",
    description: "Saved notes will appear here after each generation."
  },
  {
    icon: BarChart3,
    title: "Upgrade plan",
    description: "Paid tiers will unlock more usage once billing is wired."
  }
];

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const db = getDb();
  const userRecord = db ? await syncCurrentUser(userId) : null;

  let initialMeetings: MeetingRecord[] = [];

  if (db && userRecord) {
    try {
      const rows = await db.select().from(meetings).where(eq(meetings.userId, userRecord.id)).orderBy(desc(meetings.createdAt)).limit(8);
      initialMeetings = rows.map((row) => ({
        id: row.id,
        title: row.title,
        summary: row.summary,
        actionItems: parseBullets(row.actionItems),
        decisions: parseBullets(row.decisions),
        nextSteps: parseBullets(row.nextSteps),
        transcript: row.transcript,
        createdAt: row.createdAt.toISOString()
      }));
    } catch {
      initialMeetings = [];
    }
  }

  const setupIssues = [
    !env.GROQ_API_KEY && !env.Groq_API_KEY && !env.OPENAI_API_KEY ? "Add GROQ_API_KEY so the transcript generator can run." : null,
    !env.DATABASE_URL ? "Add DATABASE_URL so meeting notes can be saved and reloaded." : null
  ].filter((item): item is string => Boolean(item));

  const displayName = userRecord?.name ?? userId;
  const plan = userRecord?.subscriptionTier ?? "free";
  const count = initialMeetings.length;

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-6 py-10 text-white lg:px-8">
      <div className="flex flex-col gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-200">Dashboard</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">Your meeting notes workspace</h1>
          <p className="mt-3 max-w-2xl text-white/65">
            Paste a transcript, generate an AI summary, and keep every result tied to the signed-in user.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <AuthMenu />
          <Link
            href="/billing"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
          >
            View billing
          </Link>
          <Link href="/sign-up" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-cyan-100">
            Start setup <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {quickStats.map((stat) => (
          <Card key={stat.label} className="bg-white/5">
            <CardContent>
              <p className="text-sm text-white/55">{stat.label}</p>
              <p className="mt-3 text-3xl font-semibold text-white">{stat.label === "Saved meetings" ? String(count) : stat.value}</p>
              <p className="mt-2 text-sm text-white/50">{stat.note}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mt-8">
        <MeetingWorkbench
          initialMeetings={initialMeetings}
          displayName={displayName}
          plan={plan}
          setupIssues={setupIssues}
        />
      </section>

      <section className="grid gap-6 border-t border-white/10 py-16 lg:grid-cols-3 lg:py-20">
        {shortcuts.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.title} className="rounded-3xl border border-white/10 bg-slate-950/55 p-6 shadow-glow">
              <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/60">
                Workflow
              </div>
              <div className="mt-4 flex items-center gap-3">
                <Icon className="h-5 w-5 text-cyan-300" />
                <h2 className="text-xl font-medium text-white">{item.title}</h2>
              </div>
              <p className="mt-3 text-sm leading-7 text-white/65">{item.description}</p>
            </article>
          );
        })}
      </section>

      <section className="border-t border-white/10 py-16 lg:py-20">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <Card className="bg-white/5">
            <CardContent className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-200">What’s ready now</p>
              <div className="space-y-3 text-sm leading-7 text-white/65">
                <p className="flex items-center gap-2 text-white/80">
                  <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                  Real login and session persistence through Clerk
                </p>
                <p className="flex items-center gap-2 text-white/80">
                  <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                  AI transcript generation endpoint
                </p>
                <p className="flex items-center gap-2 text-white/80">
                  <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                  Per-user meeting history saved when the database is connected
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-950/70">
            <CardContent className="space-y-3">
              <p className="text-sm text-cyan-200">Setup status</p>
              <h2 className="text-2xl font-semibold text-white">Core loop is in place</h2>
              <p className="text-sm leading-7 text-white/65">
                If the database and Groq key are configured, this dashboard becomes a real transcript-to-notes app. If not, the app still builds and clearly tells you what to add.
              </p>
              {setupIssues.length ? (
                <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-50">
                  {setupIssues.map((issue) => (
                    <p key={issue}>• {issue}</p>
                  ))}
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
