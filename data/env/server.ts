import { z } from "zod";

import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    ANALYZE: z
      .enum(["true", "false"])
      .optional()
      .transform((value) => value === "true"),
    CI: z
      .enum(["true", "false", "0", "1"])
      .optional()
      .transform((value) => value === "true" || value === "1"),
    VERCEL_URL: z.string().optional(),
    LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).optional().default("info"),
    /**
     * Clerk auth envs
     */
    CLERK_SECRET_KEY: z.string(),
    /**
     * Firebase envs
     */
    FIREBASE_PROJECT_ID: z.string(),
    FIREBASE_CLIENT_EMAIL: z.string(),
    FIREBASE_PRIVATE_KEY: z.string()
  },
  experimental__runtimeEnv: process.env,
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true
});
