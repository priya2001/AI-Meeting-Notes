import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { databaseUrl } from "@/lib/env";
import * as schema from "./schema";

type Database = ReturnType<typeof drizzle>;

let dbInstance: Database | null = null;

export function getDb() {
  if (!databaseUrl) {
    return null;
  }

  if (!dbInstance) {
    const sql = neon(databaseUrl, {
      fetchOptions: {
        signal: AbortSignal.timeout(60_000)
      }
    });
    dbInstance = drizzle(sql, { schema });
  }

  return dbInstance;
}
