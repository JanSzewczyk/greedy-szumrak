import { NextResponse } from "next/server";
import { seedBudgetTemplates } from "~/features/budget/server/db/seed-budget-templates";
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
    const [error, budgetTemplatesResult] = await seedBudgetTemplates({ force });

    if (error) {
      throw error;
    }

    const response = {
      success: true,
      results: {
        budgetTemplates: budgetTemplatesResult
      }
    };

    logger.info({ response }, "Seed API endpoint completed successfully");

    return NextResponse.json(response);
  } catch (error) {
    logger.error({ error }, "Seed API endpoint failed");

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      },
      { status: 500 }
    );
  }
}
