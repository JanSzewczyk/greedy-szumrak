import "server-only";

import { seedBudgetTemplates } from "~/features/budget/server/db/seed-budget-templates";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "auto-seed" });

let seedingInitialized = false;
let seedingInProgress = false;

/**
 * Automatically seeds the database on application startup
 * Uses a flag to ensure seeding only happens once per application lifecycle
 */
export async function autoSeedDatabase() {
  // Skip if already initialized or in progress
  if (seedingInitialized || seedingInProgress) {
    logger.debug("Auto-seed already initialized or in progress, skipping");
    return;
  }

  seedingInProgress = true;

  try {
    logger.info("Starting automatic database seeding");

    // Seed budget templates
    await seedBudgetTemplates({ force: false });

    // Add more seed functions here for other collections
    // await seedOtherCollection();

    seedingInitialized = true;
    logger.info("Automatic database seeding completed successfully");
  } catch (error) {
    logger.error({ error }, "Automatic database seeding failed");
    // Don't throw - we don't want to crash the app if seeding fails
  } finally {
    seedingInProgress = false;
  }
}

/**
 * Reset the seeding state (useful for testing)
 */
export function resetSeedingState() {
  seedingInitialized = false;
  seedingInProgress = false;
}
