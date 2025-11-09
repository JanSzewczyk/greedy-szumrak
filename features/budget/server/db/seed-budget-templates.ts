import "server-only";

import { DEFAULT_BUDGET_TEMPLATES } from "~/features/budget/data/predefined-budget-templates";
import { seedCollection, shouldSeedCollection } from "~/lib/firebase/seeder";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "budget-templates-seeder" });

const BUDGET_TEMPLATES_COLLECTION = "budget-templates";

/**
 * Seeds predefined budget templates into Firestore
 * Only creates templates that don't exist
 */
export async function seedBudgetTemplates(options: { force?: boolean } = {}) {
  const { force = false } = options;

  try {
    logger.info({ force }, "Starting budget templates seed");

    // Check if seeding is needed (unless force is true)
    if (!force) {
      const needsSeeding = await shouldSeedCollection(BUDGET_TEMPLATES_COLLECTION, DEFAULT_BUDGET_TEMPLATES.length);

      if (!needsSeeding) {
        logger.info("Budget templates collection already populated, skipping seed");
        return { skipped: true, stats: null };
      }
    }

    // Seed the collection
    const stats = await seedCollection({
      collectionName: BUDGET_TEMPLATES_COLLECTION,
      data: DEFAULT_BUDGET_TEMPLATES,
      forceUpdate: force
    });

    logger.info({ stats }, "Budget templates seed completed");

    return { skipped: false, stats };
  } catch (error) {
    logger.error({ error }, "Failed to seed budget templates");
    throw error;
  }
}
