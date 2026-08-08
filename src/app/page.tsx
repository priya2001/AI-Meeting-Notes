import Link from "next/link";
import { ArrowRight, BadgeCheck, BrainCircuit, FileText, Lock, Sparkles, Zap } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Paste a transcript, get real notes",
    description: "Drop in a meeting transcript and turn it into a clean summary, action items, decisions, and follow-ups."
  },
  {
    icon: FileText,
    title: "Saved history for every user",
    description: "Each meeting note belongs to the signed-in user so teams can revisit past conversations later."
  },
  {
    icon: Lock,
    title: "Built for a real SaaS flow",
    description: "Sign up, unlock a plan, and move through the product without a human manually intervening."
  }
];

const tiers = [
  {
    name: "Starter",
    price: "$0",
    summary: "For testing the workflow and trying a few meetings.",
    features: ["3 notes per month", "Basic summary output", "Saved note history"],
    cta: "Start free",
    ctaHref: "/sign-up"
  },
  {
    name: "Pro",
    price: "$19",
    summary: "For founders, operators, and power users.",
    features: ["Unlimited notes", "Action items and decisions", "Priority processing"],
    cta: "Go Pro",
    ctaHref: "/sign-up"
  }
];

const steps = [
  {
    title: "1. Sign up",
    description: "Create an account and land inside a protected dashboard."
  },
  {
    title: "2. Paste transcript",
    description: "Add a meeting transcript or notes from a call."
  },
  {
    title: "3. Get the output",
    description: "Receive a structured summary that your team can act on."
  }
];

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.18),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(251,191,36,0.12),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(96,165,250,0.08),transparent_25%)]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-6 lg:px-8">
        <header className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400/15 text-cyan-300">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.24em] text-cyan-200 uppercase">MeetWise</p>
              <p className="text-xs text-white/45">AI meeting notes SaaS</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-white/65 md:flex">
            <a href="#features" className="transition hover:text-white">Features</a>
            <a href="#pricing" className="transition hover:text-white">Pricing</a>
            <a href="#how-it-works" className="transition hover:text-white">How it works</a>
          </nav>

          <div className="flex items-center gap-3 text-sm">
            <Link className="text-white/70 transition hover:text-white" href="/sign-in">
              Sign in
            </Link>
            <Link
              className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-4 py-2 font-medium text-slate-950 transition hover:bg-cyan-300"
              href="/sign-up"
            >
              Start free <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </header>

        <section className="grid flex-1 items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100">
              <BadgeCheck className="h-4 w-4" />
              Full-stack SaaS challenge build
            </div>

            <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Turn messy meeting transcripts into clear next steps.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
              MeetWise is a real AI meeting notes product: sign up, paste a transcript, generate a summary, and keep every result saved in your account.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-slate-950 transition hover:bg-cyan-100"
              >
                Start free <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#pricing"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 font-medium text-white transition hover:bg-white/10"
              >
                View pricing
              </a>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {[
                { label: "Real auth", value: "Clerk sessions" },
                { label: "Data saved", value: "Per-user history" },
                { label: "Monetization", value: "Stripe-ready billing" }
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-white/45">{stat.label}</p>
                  <p className="mt-2 text-sm font-medium text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-cyan-950/20 backdrop-blur">
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/85 p-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-sm text-cyan-200">Latest note</p>
                  <h2 className="mt-1 text-xl font-semibold text-white">Weekly Product Sync</h2>
                </div>
                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
                  Saved
                </span>
              </div>

              <div className="mt-5 space-y-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/40">Summary</p>
                  <p className="mt-2 text-sm leading-7 text-white/75">
                    The team aligned on the launch timeline, finalized the homepage copy, and moved the billing integration to the top of the sprint.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/40">Action items</p>
                    <ul className="mt-3 space-y-2 text-sm text-white/75">
                      <li>• Ship onboarding copy by Friday</li>
                      <li>• Connect Stripe checkout in phase 4</li>
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/40">Decisions</p>
                    <ul className="mt-3 space-y-2 text-sm text-white/75">
                      <li>• Keep Starter capped at 3 notes</li>
                      <li>• Pro unlocks unlimited notes</li>
                    </ul>
                  </div>
                </div>

                <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/10 p-4">
                  <p className="text-sm font-medium text-cyan-100">Why this matters</p>
                  <p className="mt-2 text-sm leading-7 text-cyan-50/80">
                    This is not a mockup. The product is designed so a stranger can sign up, upgrade, and use it without anyone manually helping them.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="border-t border-white/10 py-16 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-200">Features</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Everything needed for a believable hackathon SaaS.</h2>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article key={feature.title} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                  <Icon className="h-6 w-6 text-cyan-300" />
                  <h3 className="mt-4 text-xl font-medium text-white">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/65">{feature.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section id="how-it-works" className="grid gap-6 border-t border-white/10 py-16 lg:grid-cols-3 lg:py-20">
          {steps.map((step) => (
            <article key={step.title} className="rounded-3xl border border-white/10 bg-slate-950/55 p-6 shadow-glow">
              <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/60">
                Workflow
              </div>
              <h3 className="mt-4 text-xl font-medium text-white">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/65">{step.description}</p>
            </article>
          ))}
        </section>

        <section id="pricing" className="border-t border-white/10 py-16 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-200">Pricing</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Two tiers, clear gating, and real signup links.</h2>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {tiers.map((tier) => (
              <article key={tier.name} className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-glow">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-white/60">{tier.name}</p>
                    <div className="mt-3 flex items-end gap-2">
                      <span className="text-4xl font-semibold text-white">{tier.price}</span>
                      <span className="pb-1 text-sm text-white/50">/ month</span>
                    </div>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/60">
                    {tier.name === "Starter" ? "Best for testing" : "Best for builders"}
                  </span>
                </div>

                <p className="mt-4 text-sm text-white/65">{tier.summary}</p>

                <ul className="mt-6 space-y-3 text-sm text-white/75">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-cyan-300" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={tier.ctaHref}
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 font-medium text-slate-950 transition hover:bg-cyan-100"
                >
                  {tier.cta} <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </section>

        <footer className="border-t border-white/10 py-8 text-sm text-white/45">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p>MeetWise is being built as a real SaaS prototype for the hackathon.</p>
            <div className="flex gap-4">
              <Link href="/sign-in" className="transition hover:text-white">
                Sign in
              </Link>
              <Link href="/sign-up" className="transition hover:text-white">
                Create account
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
