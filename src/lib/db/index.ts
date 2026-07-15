import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { env } from "@/lib/env";
import * as schema from "./schema";

const connectionString = env.DATABASE_URL ?? "";

const client = postgres(connectionString, {
  max: 1,
  ssl: "require"
});

export const db = drizzle(client, { schema });