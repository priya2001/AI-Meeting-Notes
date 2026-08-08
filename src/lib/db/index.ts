import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { env } from "@/lib/env";
import * as schema from "./schema";

type Database = ReturnType<typeof drizzle>;

let dbInstance: Database | null = null;

export function getDb() {
  if (!env.DATABASE_URL) {
    return null;
  }

  if (!dbInstance) {
    const client = postgres(env.DATABASE_URL, {
      max: 1,
      ssl: env.DATABASE_URL.includes("localhost") ? false : "require",
      connect_timeout: 60
    });

    dbInstance = drizzle(client, { schema });
  }

  return dbInstance;
}
