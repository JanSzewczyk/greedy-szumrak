/* eslint-disable @typescript-eslint/no-var-requires */
const { createEnv } = require("@t3-oss/env-nextjs");
const { z } = require("zod");

const env = createEnv({
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
    NEXTAUTH_SECRET: z.string().min(10),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    ADMIN_FIREBASE_PROJECT_ID: z.string(),
    ADMIN_FIREBASE_CLIENT_EMAIL: z.string().email(),
    ADMIN_FIREBASE_PRIVATE_KEY: z.string().transform((value) => value.replace(/\\n/g, "\n"))
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    ANALYZE: process.env.ANALYZE,
    CI: process.env.CI,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    ADMIN_FIREBASE_PROJECT_ID: process.env.ADMIN_FIREBASE_PROJECT_ID,
    ADMIN_FIREBASE_CLIENT_EMAIL: process.env.ADMIN_FIREBASE_CLIENT_EMAIL,
    ADMIN_FIREBASE_PRIVATE_KEY: process.env.ADMIN_FIREBASE_PRIVATE_KEY
  }
});

module.exports = { env };
