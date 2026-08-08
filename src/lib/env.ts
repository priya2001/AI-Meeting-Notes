import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().optional(),
  DATABASE_POOL_URL: z.string().optional(),
  DIRECT_URL: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  GROQ_API_KEY: z.string().optional(),
  Groq_API_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_PRICE_PRO: z.string().optional(),
  STRIPE_PRICE_ENTERPRISE: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().default("http://localhost:3000")
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  DATABASE_POOL_URL: process.env.DATABASE_POOL_URL,
  DIRECT_URL: process.env.DIRECT_URL,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  Groq_API_KEY: process.env.Groq_API_KEY,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  STRIPE_PRICE_PRO: process.env.STRIPE_PRICE_PRO,
  STRIPE_PRICE_ENTERPRISE: process.env.STRIPE_PRICE_ENTERPRISE,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL
});

export const databaseUrl = env.DATABASE_POOL_URL ?? env.DATABASE_URL ?? null;
export const llmApiKey = env.GROQ_API_KEY ?? env.Groq_API_KEY ?? env.OPENAI_API_KEY ?? null;
