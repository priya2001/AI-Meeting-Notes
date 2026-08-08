import { auth } from "@clerk/nextjs/server";
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

  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured yet." }, { status: 503 });
  }

  const userRecord = await syncCurrentUser(userId);

  if (!userRecord?.stripeCustomerId) {
    return NextResponse.json({ error: "No billing customer is attached yet." }, { status: 400 });
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: userRecord.stripeCustomerId,
      return_url: `${env.NEXT_PUBLIC_APP_URL}/billing`
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Could not open billing portal."
      },
      { status: 500 }
    );
  }
}
