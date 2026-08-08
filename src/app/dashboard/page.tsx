import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ArrowRight, BarChart3, CheckCircle2, FilePlus2, History, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AuthMenu } from "@/components/auth-menu";

export const dynamic = "force-dynamic";

const quickStats = [
  { label: "Notes this month", value: "0 / 3", note: "Starter plan limit later" },
  { label: "Saved meetings", value: "0", note: "Will show after DB sync is stable" },
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
    description: "Saved notes will appear here after the database sync is stable."
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
              <p className="mt-3 text-3xl font-semibold text-white">{stat.value}</p>
              <p className="mt-2 text-sm text-white/50">{stat.note}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="bg-slate-950/70">
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cyan-200">Next action</p>
                <h2 className="mt-1 text-2xl font-semibold">Generate your first meeting note</h2>
              </div>
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
                DB-safe render
              </span>
            </div>

            <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-5">
              <p className="text-sm leading-7 text-white/65">
                The transcript-to-summary flow lives in the AI route. This dashboard no longer depends on Neon during render, so it will stay open even if the database has connection issues.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="flex items-center gap-2 text-sm font-medium text-white">
                  <Sparkles className="h-4 w-4 text-cyan-300" />
                  AI summary
                </p>
                <p className="mt-2 text-sm leading-7 text-white/60">Summaries, action items, decisions, and next steps.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="flex items-center gap-2 text-sm font-medium text-white">
                  <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                  Persistence
                </p>
                <p className="mt-2 text-sm leading-7 text-white/60">History will load once Neon is reachable from this environment.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5">
          <CardContent className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/45">Shortcuts</p>
            <div className="space-y-3">
              {shortcuts.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-xl border border-white/10 bg-white/5 p-2 text-cyan-300">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{item.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-white/60">{item.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
