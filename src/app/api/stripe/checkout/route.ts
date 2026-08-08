import { currentUser, auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { getStripe } from "@/lib/stripe";
import { syncCurrentUser } from "@/lib/users";

export async function POST() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  const stripe = getStripe();

  if (!stripe || !env.STRIPE_PRICE_PRO) {
    return NextResponse.json({ error: "Stripe is not configured yet." }, { status: 503 });
  }

  const clerkUser = await currentUser();
  const userRecord = await syncCurrentUser(userId);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: env.STRIPE_PRICE_PRO,
          quantity: 1
        }
      ],
      success_url: `${env.NEXT_PUBLIC_APP_URL}/billing?success=1`,
      cancel_url: `${env.NEXT_PUBLIC_APP_URL}/billing?canceled=1`,
      client_reference_id: userId,
      metadata: {
        clerkUserId: userId,
        plan: "pro"
      },
      subscription_data: {
        metadata: {
          clerkUserId: userId,
          plan: "pro"
        }
      },
      customer: userRecord?.stripeCustomerId ?? undefined,
      customer_email: userRecord?.stripeCustomerId
        ? undefined
        : clerkUser?.emailAddresses?.[0]?.emailAddress ?? undefined
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Could not start checkout."
      },
      { status: 500 }
    );
  }
}
