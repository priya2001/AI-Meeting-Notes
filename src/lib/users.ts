import { currentUser } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";

export async function syncCurrentUser(clerkUserId: string) {
  const db = getDb();

  if (!db) {
    return null;
  }

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? `${clerkUserId}@clerk.local`;
  const name = [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ").trim() || clerkUser?.username || null;

  const [userRecord] = await db
    .insert(users)
    .values({
      clerkId: clerkUserId,
      email,
      name
    })
    .onConflictDoUpdate({
      target: users.clerkId,
      set: {
        email,
        name
      }
    })
    .returning();

  return userRecord ?? null;
}
