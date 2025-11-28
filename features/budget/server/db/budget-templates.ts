import "server-only";

import { DEFAULT_BUDGET_TEMPLATES } from "~/features/budget/data/predefined-budget-templates";
import { type BudgetTemplate } from "~/features/budget/types/budget-template";
import { db } from "~/lib/firebase";
import { categorizeDbError, DbError } from "~/lib/firebase/errors";
import { seedCollection, type SeedCollectionResult, shouldSeedCollection } from "~/lib/firebase/seeder";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "budget-templates-db" });

const COLLECTION_NAME = "budget-templates";
const RESOURCE_NAME = "BudgetTemplate";

function transformFirestoreToBudgetTemplate(docId: string, data: FirebaseFirestore.DocumentData): BudgetTemplate {
  return {
    id: docId,
    ...data,
    updatedAt: data.updatedAt?.toDate(),
    createdAt: data.createdAt?.toDate()
  } as BudgetTemplate;
}

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
): Promise<[null, SeedBudgetTemplatesResult] | [DbError, null]> {
  const { force = false } = options;

  try {
    logger.info({ force }, "Starting budget templates seed");

    // Check if seeding is needed (unless force is true)
    if (!force) {
      const needsSeeding = await shouldSeedCollection(COLLECTION_NAME, DEFAULT_BUDGET_TEMPLATES.length);

      if (!needsSeeding) {
        logger.info("Budget templates collection already populated, skipping seed");
        return [null, { skipped: true, stats: null }];
      }
    }

    // Seed the collection
    const stats = await seedCollection({
      collectionName: COLLECTION_NAME,
      data: DEFAULT_BUDGET_TEMPLATES,
      forceUpdate: force
    });

    logger.info({ stats }, "Budget templates seed completed");

    return [null, { skipped: false, stats }];
  } catch (error) {
    const dbError = categorizeDbError(error, RESOURCE_NAME);
    logger.error(
      {
        errorCode: dbError.code,
        isRetryable: dbError.isRetryable
      },
      "Failed to seed budget templates"
    );
    return [dbError, null];
  }
}

export async function getBudgetTemplates(): Promise<[null, Array<BudgetTemplate>] | [DbError, null]> {
  try {
    logger.info("Fetching budget templates");

    const budgetTemplatesDocs = await db.collection(COLLECTION_NAME).get();

    if (budgetTemplatesDocs.empty) {
      const error = DbError.notFound(RESOURCE_NAME);
      logger.warn({ errorCode: error.code }, "Budget templates collection is empty");
      return [error, null];
    }

    const data = budgetTemplatesDocs.docs.map((doc) => transformFirestoreToBudgetTemplate(doc.id, doc.data()));

    logger.info({ count: data.length }, "Budget templates fetched successfully");
    return [null, data];
  } catch (error) {
    const dbError = categorizeDbError(error, RESOURCE_NAME);
    logger.error(
      {
        errorCode: dbError.code,
        isRetryable: dbError.isRetryable
      },
      "Error fetching budget templates"
    );
    return [dbError, null];
  }
}

export async function getBudgetTemplateById(templateId: string): Promise<[null, BudgetTemplate] | [DbError, null]> {
  // Input validation
  if (!templateId || templateId.trim() === "") {
    const error = DbError.validation("Invalid templateId provided");
    logger.warn({ templateId, errorCode: error.code }, "Invalid templateId provided");
    return [error, null];
  }

  try {
    logger.info({ templateId }, "Fetching budget template by ID");

    const doc = await db.collection(COLLECTION_NAME).doc(templateId).get();

    if (!doc.exists) {
      const error = DbError.notFound(RESOURCE_NAME);
      logger.warn({ templateId, errorCode: error.code }, "Budget template not found");
      return [error, null];
    }

    const data = doc.data();
    if (!data) {
      const error = DbError.dataCorruption(RESOURCE_NAME);
      logger.error({ templateId, errorCode: error.code }, "Budget template exists but data is undefined");
      return [error, null];
    }

    logger.info({ templateId }, "Budget template fetched successfully");
    return [null, transformFirestoreToBudgetTemplate(doc.id, data)];
  } catch (error) {
    const dbError = categorizeDbError(error, RESOURCE_NAME);
    logger.error(
      {
        templateId,
        errorCode: dbError.code,
        isRetryable: dbError.isRetryable
      },
      "Error fetching budget template"
    );
    return [dbError, null];
  }
}
