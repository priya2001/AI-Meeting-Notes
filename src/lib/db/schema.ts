import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const subscriptionTierEnum = pgEnum("subscription_tier", ["free", "pro", "enterprise"]);
export const subscriptionStatusEnum = pgEnum("subscription_status", ["active", "trialing", "past_due", "canceled", "incomplete"]);
export const subscriptionPlanEnum = pgEnum("subscription_plan", ["free", "pro", "enterprise"]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkId: text("clerk_id").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name"),
  subscriptionTier: subscriptionTierEnum("subscription_tier").notNull().default("free"),
  stripeCustomerId: text("stripe_customer_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const meetings = pgTable("meetings", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  transcript: text("transcript").notNull(),
  summary: text("summary").notNull(),
  actionItems: text("action_items").notNull(),
  decisions: text("decisions").notNull(),
  nextSteps: text("next_steps").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  stripeSubscriptionId: text("stripe_subscription_id").notNull().unique(),
  status: subscriptionStatusEnum("status").notNull(),
  plan: subscriptionPlanEnum("plan").notNull(),
  currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }).notNull()
});