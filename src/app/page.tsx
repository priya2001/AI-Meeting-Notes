import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles, FileText, ShieldCheck, Bot } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI summaries in seconds",
    description: "Turn raw transcripts into concise executive summaries, action items, decisions, and next steps."
  },
  {
    icon: FileText,
    title: "Transcript paste or file upload",
    description: "Drop in .txt or .docx files, or paste a transcript directly into the dashboard."
  },
  {
    icon: ShieldCheck,
    title: "Secure by default",
    description: "Clerk auth, Supabase Postgres, and Stripe billing make the foundation production-ready."
  }
];

const pricing = [
  {
    name: "Free",
    price: "$0",
    description: "For testing the workflow.",
    items: ["3 meetings / month", "Basic summaries", "Search history"]
  },
  {
    name: "Pro",
    price: "$19",
    description: "For individuals and power users.",
    items: ["Unlimited meetings", "PDF export", "Priority AI generation"]
  },
  {
    name: "Enterprise",
    price: "$49",
    description: "For teams and branded workflows.",
    items: ["Team access", "Custom branding", "Admin billing"]
  }
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 lg:px-8">
      <header className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur">
        <div>
          <p className="text-sm font-semibold tracking-[0.2em] text-cyan-300 uppercase">MeetWise</p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Link className="text-white/70 transition hover:text-white" href="/sign-in">Sign in</Link>
          <Link className="rounded-full bg-cyan-400 px-4 py-2 font-medium text-slate-950 transition hover:bg-cyan-300" href="/sign-up">
            Get started
          </Link>
        </div>
      </header>

      <section className="grid flex-1 items-center gap-12 py-20 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
            <Bot className="h-4 w-4" />
            AI Meeting Notes Generator
          </div>
          <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Turn every meeting into clear action.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
            MeetWise converts transcripts into executive summaries, action items, decision logs, and next steps so teams can move faster.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/sign-up" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-slate-950 transition hover:bg-cyan-100">
              Start free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="#pricing" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 font-medium text-white transition hover:bg-white/10">
              View pricing
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-4 text-sm text-white/60">
            {['Clerk Auth', 'Stripe Billing', 'Supabase Postgres', 'OpenAI GPT-4'].map((item) => (
              <div key={item} className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur">
          <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-5">
            <p className="text-sm text-cyan-200">Executive Summary</p>
            <p className="mt-3 text-sm leading-7 text-white/70">
              The team agreed to launch the onboarding redesign next Monday, with engineering responsible for the checkout flow and marketing finalizing the launch copy.
            </p>
            <div className="mt-6 space-y-4 text-sm">
              <div>
                <p className="text-white/90">Key Action Items</p>
                <ul className="mt-2 space-y-2 text-white/70">
                  <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-cyan-300" /> Ship onboarding screens by Friday - Alex</li>
                  <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-cyan-300" /> Update pricing copy - Priya</li>
                </ul>
              </div>
              <div>
                <p className="text-white/90">Decision Log</p>
                <p className="mt-2 text-white/70">Approved the Pro plan at $19/month and kept the Free plan limited to three meetings monthly.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 border-t border-white/10 py-20 lg:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <article key={feature.title} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <Icon className="h-6 w-6 text-cyan-300" />
              <h2 className="mt-4 text-xl font-medium text-white">{feature.title}</h2>
              <p className="mt-3 text-sm leading-7 text-white/65">{feature.description}</p>
            </article>
          );
        })}
      </section>

      <section id="pricing" className="border-t border-white/10 py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">Pricing</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">Simple plans that scale from solo work to enterprise teams.</h2>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {pricing.map((plan) => (
            <article key={plan.name} className="rounded-3xl border border-white/10 bg-slate-950/60 p-6 shadow-glow">
              <p className="text-white/60">{plan.name}</p>
              <div className="mt-3 flex items-end gap-2">
                <span className="text-4xl font-semibold text-white">{plan.price}</span>
                <span className="pb-1 text-sm text-white/50">/ month</span>
              </div>
              <p className="mt-3 text-sm text-white/65">{plan.description}</p>
              <ul className="mt-6 space-y-3 text-sm text-white/75">
                {plan.items.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}