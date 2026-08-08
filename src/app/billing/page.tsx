import Link from "next/link";
import { ArrowRight, BadgeCheck, CreditCard, Crown, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function BillingPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-6 py-10 text-white lg:px-8">
      <div className="flex flex-col gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-200">Billing</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">Manage your subscription</h1>
          <p className="mt-3 max-w-2xl text-white/65">
            This page is the billing hub for plan status, payment method, and cancellation. Stripe wiring comes in the next phase.
          </p>
        </div>
        <Link href="/sign-up" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-cyan-100">
          Upgrade now <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <Card className="bg-slate-950/70">
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cyan-200">Current plan</p>
                <h2 className="mt-1 text-3xl font-semibold">Starter</h2>
              </div>
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
                Active
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Price", value: "$0 / mo" },
                { label: "Usage", value: "3 meetings" },
                { label: "Renewal", value: "Monthly" }
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/40">{item.label}</p>
                  <p className="mt-2 text-lg font-medium text-white">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="flex items-center gap-2 text-sm font-medium text-white">
                <CreditCard className="h-4 w-4 text-cyan-300" />
                Payment method
              </p>
              <p className="mt-2 text-sm leading-7 text-white/60">
                Stripe checkout will attach a real test card flow here. For now, this is the billing shell where subscription state will be displayed.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5">
          <CardContent className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/45">What you get</p>
            {[
              { icon: BadgeCheck, title: "Plan upgrade", text: "Upgrade will be handled through Stripe checkout and webhook confirmation." },
              { icon: Crown, title: "Unlocked features", text: "Paid users will remove the usage cap and get the full meeting notes workflow." },
              { icon: ShieldCheck, title: "Safe cancellation", text: "The billing page will later support canceling or downgrading subscriptions." }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-xl border border-white/10 bg-white/5 p-2 text-cyan-300">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{item.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-white/60">{item.text}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
