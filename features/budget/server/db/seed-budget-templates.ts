import "server-only";

import { DEFAULT_BUDGET_TEMPLATES } from "~/features/budget/data/predefined-budget-templates";
import { seedCollection, type SeedCollectionResult, shouldSeedCollection } from "~/lib/firebase/seeder";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "budget-templates-seeder" });

const BUDGET_TEMPLATES_COLLECTION = "budget-templates";

export type SeedBudgetTemplatesResult =
  | {
      skipped: true;
      stats: null;
    }
  | {
      skipped: false;
      stats: SeedCollectionResult;
    };

/**
 * Seeds predefined budget templates into Firestore
 * Only creates templates that don't exist
 */
export async function seedBudgetTemplates(
  options: { force?: boolean } = {}
): Promise<[null, SeedBudgetTemplatesResult] | [Error, null]> {
  const { force = false } = options;

  try {
    logger.info({ force }, "Starting budget templates seed");

    // Check if seeding is needed (unless force is true)
    if (!force) {
      const needsSeeding = await shouldSeedCollection(BUDGET_TEMPLATES_COLLECTION, DEFAULT_BUDGET_TEMPLATES.length);

      if (!needsSeeding) {
        logger.info("Budget templates collection already populated, skipping seed");
        return [null, { skipped: true, stats: null }];
      }
    }

    // Seed the collection
    const stats = await seedCollection({
      collectionName: BUDGET_TEMPLATES_COLLECTION,
      data: DEFAULT_BUDGET_TEMPLATES,
      forceUpdate: force
    });

    logger.info({ stats }, "Budget templates seed completed");

    return [null, { skipped: false, stats }];
  } catch (error) {
    logger.error({ error }, "Failed to seed budget templates");
    return [error as Error, null];
  }
}
