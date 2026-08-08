import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { AuthMenu } from "@/components/auth-menu";
import { MeetingWorkbench } from "@/components/meeting-workbench";
import { databaseUrl, env } from "@/lib/env";
import { syncCurrentUser } from "@/lib/users";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const userRecord = await syncCurrentUser(userId);
  const displayName = userRecord?.name ?? "there";
  const plan = userRecord?.subscriptionTier ?? "free";

  const setupIssues = [
    !env.GROQ_API_KEY && !env.Groq_API_KEY && !env.OPENAI_API_KEY ? "Add GROQ_API_KEY so the transcript generator can run." : null,
    !databaseUrl ? "Add DATABASE_POOL_URL or DATABASE_URL so meeting notes can be saved and loaded." : null
  ].filter((item): item is string => Boolean(item));

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-6 py-10 text-white lg:px-8">
      <div className="flex flex-col gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-200">Dashboard</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">Meeting notes workspace</h1>
          <p className="mt-3 max-w-2xl text-white/65">
            Paste a transcript, generate notes, and keep the result attached to your account.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <AuthMenu />
          <Link
            href="/billing"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Billing
          </Link>
          <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-cyan-100">
            Home <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <section className="mt-8">
        <div className="mb-4 flex items-center gap-2 text-sm text-cyan-200">
          <Sparkles className="h-4 w-4" />
          Real core flow
        </div>
        <MeetingWorkbench
          initialMeetings={[]}
          displayName={displayName}
          plan={plan}
          setupIssues={setupIssues}
        />
      </section>
    </main>
  );
}
