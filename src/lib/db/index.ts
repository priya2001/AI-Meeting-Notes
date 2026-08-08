import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { env } from "@/lib/env";
import * as schema from "./schema";

type Database = ReturnType<typeof drizzle>;

let dbInstance: Database | null = null;

export function getDb() {
  if (!env.DATABASE_URL) {
    return null;
  }

  if (!dbInstance) {
    const sql = neon(env.DATABASE_URL);
    dbInstance = drizzle(sql, { schema });
  }

  return dbInstance;
}
