import { auth } from "@clerk/nextjs/server";
import { and, desc, eq, gte, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { meetings, subscriptions } from "@/lib/db/schema";
import { syncCurrentUser } from "@/lib/users";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  const db = getDb();

  if (!db) {
    return NextResponse.json({
      plan: "free",
      usageCount: 0,
      usageLimit: 3,
      hasActiveSubscription: false,
      portalAvailable: false,
      setupNeeded: true
    });
  }

  try {
    const userRecord = await syncCurrentUser(userId);

    if (!userRecord) {
      return NextResponse.json({
        plan: "free",
        usageCount: 0,
        usageLimit: 3,
        hasActiveSubscription: false,
        portalAvailable: false,
        setupNeeded: true
      });
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [usageRow] = await db
      .select({ count: sql<number>`count(*)` })
      .from(meetings)
      .where(and(eq(meetings.userId, userRecord.id), gte(meetings.createdAt, thirtyDaysAgo)));

    const [subscriptionRow] = await db
      .select({
        status: subscriptions.status,
        plan: subscriptions.plan
      })
      .from(subscriptions)
      .where(eq(subscriptions.userId, userRecord.id))
      .orderBy(desc(subscriptions.currentPeriodEnd))
      .limit(1);

    const plan = userRecord.subscriptionTier ?? "free";
    const usageCount = Number(usageRow?.count ?? 0);
    const hasActiveSubscription = Boolean(subscriptionRow?.status === "active" || subscriptionRow?.status === "trialing");

    return NextResponse.json({
      plan,
      usageCount,
      usageLimit: plan === "pro" ? null : 3,
      hasActiveSubscription,
      portalAvailable: Boolean(userRecord.stripeCustomerId),
      subscriptionStatus: subscriptionRow?.status ?? null,
      setupNeeded: false
    });
  } catch {
    return NextResponse.json({
      plan: "free",
      usageCount: 0,
      usageLimit: 3,
      hasActiveSubscription: false,
      portalAvailable: false,
      setupNeeded: true
    });
  }
}
