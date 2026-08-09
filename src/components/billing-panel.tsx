"use client";

import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type BillingStatus = {
  plan: "free" | "pro" | "enterprise";
  usageCount: number;
  usageLimit: number | null;
  hasActiveSubscription: boolean;
  portalAvailable: boolean;
  setupNeeded: boolean;
  subscriptionStatus: string | null;
};

export function BillingPanel() {
  const [status, setStatus] = useState<BillingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkoutPending, setCheckoutPending] = useState(false);
  const [portalPending, setPortalPending] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadStatus() {
      try {
        const response = await fetch("/api/billing/status", { cache: "no-store" });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.error ?? "Failed to load billing status.");
        }

        if (!cancelled) {
          setStatus(payload as BillingStatus);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load billing status.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadStatus();

    return () => {
      cancelled = true;
    };
  }, []);

  async function startCheckout() {
    setCheckoutPending(true);
    setError(null);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error ?? "Checkout could not be started.");
      }

      if (payload.url) {
        window.location.href = payload.url as string;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout could not be started.");
    } finally {
      setCheckoutPending(false);
    }
  }

  async function openPortal() {
    setPortalPending(true);
    setError(null);

    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST"
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error ?? "Billing portal could not be opened.");
      }

      if (payload.url) {
        window.location.href = payload.url as string;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Billing portal could not be opened.");
    } finally {
      setPortalPending(false);
    }
  }

  const plan = status?.plan ?? "free";
  const isPro = plan === "pro" || plan === "enterprise";

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
      <Card className="min-w-0 bg-slate-950/70">
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-cyan-200">Current plan</p>
              <h2 className="mt-1 text-3xl font-semibold">{loading ? "Loading..." : plan === "free" ? "Starter" : "Pro"}</h2>
            </div>
            <span className={`rounded-full border px-3 py-1 text-xs font-medium ${isPro ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200" : "border-white/10 bg-white/5 text-white/60"}`}>
              {loading ? "Syncing" : isPro ? "Active" : "Free"}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { label: "Price", value: isPro ? "$19 / mo" : "$0 / mo" },
              { label: "Usage", value: loading ? "..." : status?.usageLimit ? `${status.usageCount} / ${status.usageLimit}` : "Unlimited" },
              { label: "Renewal", value: isPro ? "Monthly" : "Monthly" }
            ].map((item) => (
              <div
                key={item.label}
                className={`min-w-0 rounded-2xl border border-white/10 bg-white/5 p-4 ${
                  item.label === "Renewal" ? "sm:col-span-2" : ""
                }`}
              >
                <p className="text-xs uppercase tracking-[0.2em] text-white/40">{item.label}</p>
                <p className={`mt-2 text-lg font-medium text-white ${item.label === "Renewal" ? "whitespace-nowrap" : ""}`}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="flex items-center gap-2 text-sm font-medium text-white">
              <Sparkles className="h-4 w-4 text-cyan-300" />
              Plan behavior
            </p>
            <p className="mt-2 text-sm leading-7 text-white/60">
              {isPro
                ? "Pro unlocks unlimited meeting note generations."
                : "Starter is capped at 3 meeting notes per 30 days. Upgrade to unlock more usage."}
            </p>
          </div>

          {error ? <p className="text-sm text-red-300">{error}</p> : null}
        </CardContent>
      </Card>

      <Card className="min-w-0 bg-white/5">
        <CardContent className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/45">Actions</p>
          <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
            <h3 className="font-medium text-white">Upgrade to Pro</h3>
            <p className="mt-1 text-sm leading-6 text-white/60">
              Pay in test mode with Stripe Checkout, then the webhook upgrades your account.
            </p>
            <Button className="mt-4 w-full" onClick={startCheckout} disabled={checkoutPending || isPro}>
              {checkoutPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Starting checkout...
                </>
              ) : isPro ? (
                "Already on Pro"
              ) : (
                <>
                  Upgrade now <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
            <h3 className="font-medium text-white">Manage subscription</h3>
            <p className="mt-1 text-sm leading-6 text-white/60">
              Open the Stripe customer portal to cancel or manage the active subscription.
            </p>
            <Button className="mt-4 w-full" variant="secondary" onClick={openPortal} disabled={portalPending || !status?.portalAvailable}>
              {portalPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Opening portal...
                </>
              ) : status?.portalAvailable ? (
                "Open billing portal"
              ) : (
                "Portal unavailable yet"
              )}
            </Button>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
            <h3 className="font-medium text-white">What you unlock</h3>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-white/65">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                Unlimited meeting note generations
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                Real subscription state saved in your database
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                Stripe portal for cancellation and card updates
              </li>
            </ul>
          </div>

          {status?.setupNeeded ? (
            <p className="text-sm text-amber-200">Billing setup still needs a live Stripe key or database connection.</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
