import { NextResponse } from "next/server";
import { budgetTemplates } from "~/features/budget/server/db/budget-templates";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "seed-api" });

/**
 * API endpoint to seed database with predefined data
 * This can be called manually or automatically on application startup
 *
 * Usage:
 * - GET /api/budget-templates/seed - Seeds all collections (only missing data)
 * - GET /api/budget-templates/seed?force=true - Forces re-seeding (updates existing data)
 *
 * Security: This endpoint should be protected in production
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const force = searchParams.get("force") === "true";

    logger.info({ force }, "Seed API endpoint called");

    // Seed budget templates
    const [error, budgetTemplatesResult] = await budgetTemplates({ force });
    if (error) {
      logger.error({ error, force }, "Seed operation failed");
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const response = {
      success: true,
      data: {
        budgetTemplates: budgetTemplatesResult
      },
      message: force ? "Budget templates force-seeded successfully" : "Budget templates seeded successfully"
    };

    logger.info(
      {
        stats: budgetTemplatesResult.stats,
        force
      },
      "Seed operation completed"
    );

    return NextResponse.json(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    logger.error({ error, errorMessage }, "Unexpected seed endpoint error");

    return NextResponse.json(
      {
        success: false,
        error: errorMessage
      },
      { status: 500 }
    );
  }
}
