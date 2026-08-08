import Stripe from "stripe";
import { env } from "@/lib/env";

export function getStripe() {
  if (!env.STRIPE_SECRET_KEY) {
    return null;
  }

  return new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-08-27.basil"
  });
}

export function planFromPriceId(priceId: string | null | undefined) {
  if (!priceId) {
    return "free";
  }

  if (priceId === env.STRIPE_PRICE_PRO) {
    return "pro";
  }

  if (priceId === env.STRIPE_PRICE_ENTERPRISE) {
    return "enterprise";
  }

  return "free";
}
