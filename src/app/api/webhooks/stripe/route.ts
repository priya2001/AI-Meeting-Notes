import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { env } from "@/lib/env";
import { getDb } from "@/lib/db";
import { subscriptions, users } from "@/lib/db/schema";
import { getStripe, planFromPriceId } from "@/lib/stripe";

function normalizeSubscriptionStatus(status: Stripe.Subscription.Status) {
  if (status === "active" || status === "trialing" || status === "past_due" || status === "canceled" || status === "incomplete") {
    return status;
  }

  return "incomplete";
}

function getCurrentPeriodEnd(subscription: Stripe.Subscription) {
  return new Date((subscription.items.data[0]?.current_period_end ?? Math.floor(Date.now() / 1000)) * 1000);
}

async function findUserIdFromEvent(clerkUserId?: string | null, stripeCustomerId?: string | null) {
  const db = getDb();

  if (!db) {
    return null;
  }

  if (clerkUserId) {
    const [user] = await db.select().from(users).where(eq(users.clerkId, clerkUserId)).limit(1);
    if (user) {
      return user;
    }
  }

  if (stripeCustomerId) {
    const [user] = await db.select().from(users).where(eq(users.stripeCustomerId, stripeCustomerId)).limit(1);
    if (user) {
      return user;
    }
  }

  return null;
}

export async function POST(request: Request) {
  const stripe = getStripe();

  if (!stripe || !env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe webhook is not configured." }, { status: 503 });
  }

  const signature = headers().get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  const payload = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Invalid Stripe webhook."
      },
      { status: 400 }
    );
  }

  const db = getDb();

  if (!db) {
    return NextResponse.json({ received: true, setupNeeded: true });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const subscriptionId = typeof session.subscription === "string" ? session.subscription : null;
      const customerId = typeof session.customer === "string" ? session.customer : null;
      const clerkUserId = session.client_reference_id ?? session.metadata?.clerkUserId ?? null;

      if (!subscriptionId || !clerkUserId) {
        return NextResponse.json({ received: true });
      }

      const userRecord = await findUserIdFromEvent(clerkUserId, customerId);
      if (!userRecord) {
        return NextResponse.json({ received: true });
      }

      const subscription = (await stripe.subscriptions.retrieve(subscriptionId)) as Stripe.Subscription;
      const plan = planFromPriceId(subscription.items.data[0]?.price.id);
      const status = normalizeSubscriptionStatus(subscription.status);

      await db
        .insert(subscriptions)
        .values({
          userId: userRecord.id,
          stripeSubscriptionId: subscription.id,
          status,
          plan,
          currentPeriodEnd: getCurrentPeriodEnd(subscription)
        })
        .onConflictDoUpdate({
          target: subscriptions.stripeSubscriptionId,
          set: {
            userId: userRecord.id,
            status,
            plan,
            currentPeriodEnd: getCurrentPeriodEnd(subscription)
          }
        });

      await db
        .update(users)
        .set({
          stripeCustomerId: customerId,
          subscriptionTier: plan === "pro" || plan === "enterprise" ? plan : "free"
        })
        .where(eq(users.id, userRecord.id));
    }

    if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = typeof subscription.customer === "string" ? subscription.customer : null;
      const clerkUserId = subscription.metadata?.clerkUserId ?? null;
      const userRecord = await findUserIdFromEvent(clerkUserId, customerId);

      if (userRecord) {
        const plan = planFromPriceId(subscription.items.data[0]?.price.id);
        const status = normalizeSubscriptionStatus(subscription.status);

        await db
          .insert(subscriptions)
          .values({
            userId: userRecord.id,
            stripeSubscriptionId: subscription.id,
            status,
            plan,
            currentPeriodEnd: getCurrentPeriodEnd(subscription)
          })
          .onConflictDoUpdate({
            target: subscriptions.stripeSubscriptionId,
            set: {
              userId: userRecord.id,
              status,
              plan,
              currentPeriodEnd: getCurrentPeriodEnd(subscription)
            }
          });

        await db
          .update(users)
          .set({
            subscriptionTier:
              event.type === "customer.subscription.deleted"
                ? "free"
                : plan === "pro" || plan === "enterprise"
                  ? plan
                  : "free"
          })
          .where(eq(users.id, userRecord.id));
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Webhook handling failed."
      },
      { status: 500 }
    );
  }
}
