import { NextResponse } from "next/server";
import { budgetTemplates } from "~/features/budget/server/db/budget-templates";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "seed-api" });

// Simple in-memory rate limiter (consider Redis/Vercel KV for production)
const rateLimiter = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 3; // 3 requests per minute

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = rateLimiter.get(ip);

  if (!record || now > record.resetAt) {
    rateLimiter.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return { allowed: true };
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }

  record.count++;
  return { allowed: true };
}

// Type definitions
type SeedResponse = {
  success: true;
  data: {
    budgetTemplates: {
      skipped: boolean;
      stats: {
        created: number;
        updated: number;
        skipped: number;
        errors: Array<{ id: string; error: string }>;
      };
    };
  };
  message?: string;
};

type SeedErrorResponse = {
  success: false;
  error: string;
};

/**
 * API endpoint to seed database with predefined budget templates
 *
 * Usage:
 * - GET /api/budget-templates/seed - Seeds templates (only missing data)
 * - GET /api/budget-templates/seed?force=true - Forces re-seeding (updates existing)
 *
 * Rate Limit: 3 requests per minute per IP
 */
export async function GET(request: Request) {
  try {
    // 1. Rate limiting
    const ip = request.headers.get("x-forwarded-for") ||
               request.headers.get("x-real-ip") ||
               "unknown";

    const { allowed, retryAfter } = checkRateLimit(ip);

    if (!allowed) {
      logger.warn({ ip }, "Rate limit exceeded for seed endpoint");
      return NextResponse.json(
        { success: false, error: `Rate limit exceeded. Try again in ${retryAfter}s` } satisfies SeedErrorResponse,
        {
          status: 429,
          headers: {
            "Retry-After": retryAfter?.toString() || "60"
          }
        }
      );
    }

    // 2. Parse query parameters
    const { searchParams } = new URL(request.url);
    const force = searchParams.get("force") === "true";

    logger.info({ ip, force }, "Seed endpoint called");

    // 3. Execute seeding
    const [error, budgetTemplatesResult] = await budgetTemplates({ force });

    if (error) {
      logger.error({ ip, error, force }, "Seed operation failed");
      return NextResponse.json(
        { success: false, error: error.message } satisfies SeedErrorResponse,
        { status: 500 }
      );
    }

    // 4. Build response
    const response: SeedResponse = {
      success: true,
      data: {
        budgetTemplates: budgetTemplatesResult
      },
      message: force
        ? "Budget templates force-seeded successfully"
        : "Budget templates seeded successfully"
    };

    logger.info(
      {
        ip,
        stats: budgetTemplatesResult.stats,
        force
      },
      "Seed operation completed"
    );

    return NextResponse.json(response);

  } catch (error) {
    // 5. Unexpected error handling
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    logger.error({ error, errorMessage }, "Unexpected seed endpoint error");

    return NextResponse.json(
      { success: false, error: errorMessage } satisfies SeedErrorResponse,
      { status: 500 }
    );
  }
}
