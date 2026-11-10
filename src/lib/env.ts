import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url().optional(),
  AUTH_SECRET: z.string().min(32).optional(),
  GITHUB_CLIENT_ID: z.string().min(1).optional(),
  GITHUB_CLIENT_SECRET: z.string().min(1).optional(),
  GITHUB_TOKEN: z.string().min(1).optional(),
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL || undefined,
  AUTH_SECRET: process.env.AUTH_SECRET || undefined,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || undefined,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || undefined,
  GITHUB_TOKEN: process.env.GITHUB_TOKEN || undefined,
});
