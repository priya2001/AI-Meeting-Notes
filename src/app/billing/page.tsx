import Link from "next/link";
import { ArrowLeft, BadgeCheck, CreditCard, Crown, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AuthMenu } from "@/components/auth-menu";
import { BillingPanel } from "@/components/billing-panel";

export default function BillingPage() {
  const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-6 py-10 text-white lg:px-8">
      <div className="flex flex-col gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-200">Billing</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">Manage your subscription</h1>
          <p className="mt-3 max-w-2xl text-white/65">
            Upgrade to Pro in test mode, confirm it through the webhook, and manage cancellation from the Stripe portal.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {hasClerk ? (
            <AuthMenu />
          ) : (
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Sign in
            </Link>
          )}
          <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10">
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
        </div>
      </div>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <BillingPanel />

        <Card className="bg-white/5">
          <CardContent className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/45">Plan summary</p>
            {[
              { icon: BadgeCheck, title: "Plan upgrade", text: "Stripe Checkout upgrades the account through a real webhook-confirmed subscription." },
              { icon: Crown, title: "Unlocked features", text: "Pro removes the note cap and keeps your meeting history persistent." },
              { icon: ShieldCheck, title: "Safe cancellation", text: "The billing portal lets customers manage or cancel without support intervention." },
              { icon: CreditCard, title: "Test mode", text: "You can use Stripe test cards here so no real money moves." }
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
