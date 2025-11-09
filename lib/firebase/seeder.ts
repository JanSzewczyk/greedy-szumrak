import "server-only";

import { FieldValue } from "firebase-admin/firestore";
import { db } from "~/lib/firebase";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "firebase-seeder" });

/**
 * Seed item that can be inserted into Firestore
 */
export type SeedItem<T = never> = T & {
  id: string;
};

/**
 * Configuration for seeding a collection
 */
export type SeedCollectionConfig<T = never> = {
  collectionName: string;
  data: Array<SeedItem<T>>;
  forceUpdate?: boolean; // If true, will update existing documents
};

/**
 * Seeds a collection with predefined data
 * Only creates documents that don't exist (unless forceUpdate is true)
 */
export async function seedCollection<T>(config: SeedCollectionConfig<T>): Promise<{
  created: number;
  updated: number;
  skipped: number;
  errors: Array<{ id: string; error: string }>;
}> {
  const { collectionName, data, forceUpdate = false } = config;
  const stats = { created: 0, updated: 0, skipped: 0, errors: [] as Array<{ id: string; error: string }> };

  logger.info({ collectionName, count: data.length, forceUpdate }, "Starting collection seed");

  for (const item of data) {
    const { id, ...itemData } = item;

    try {
      const docRef = db.collection(collectionName).doc(id);
      const doc = await docRef.get();

      if (doc.exists && !forceUpdate) {
        logger.debug({ collectionName, docId: id }, "Document already exists, skipping");
        stats.skipped++;
        continue;
      }

      const timestamp = FieldValue.serverTimestamp();
      const dataWithTimestamps = {
        ...itemData,
        updatedAt: timestamp,
        ...(doc.exists ? {} : { createdAt: timestamp })
      };

      if (doc.exists) {
        await docRef.update(dataWithTimestamps);
        logger.info({ collectionName, docId: id }, "Document updated");
        stats.updated++;
      } else {
        await docRef.set({ ...dataWithTimestamps, createdAt: timestamp });
        logger.info({ collectionName, docId: id }, "Document created");
        stats.created++;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error({ collectionName, docId: id, error }, "Failed to seed document");
      stats.errors.push({ id, error: errorMessage });
    }
  }

  logger.info({ collectionName, stats }, "Collection seed completed");
  return stats;
}

/**
 * Seeds multiple collections
 */
export async function seedDatabase(configs: Array<SeedCollectionConfig>): Promise<
  Map<
    string,
    {
      created: number;
      updated: number;
      skipped: number;
      errors: Array<{ id: string; error: string }>;
    }
  >
> {
  logger.info({ collectionsCount: configs.length }, "Starting database seed");

  const results = new Map<
    string,
    {
      created: number;
      updated: number;
      skipped: number;
      errors: Array<{ id: string; error: string }>;
    }
  >();

  for (const config of configs) {
    const stats = await seedCollection(config);
    results.set(config.collectionName, stats);
  }

  logger.info({ results: Object.fromEntries(results) }, "Database seed completed");
  return results;
}

/**
 * Check if seeding is needed for a collection
 * Returns true if collection is empty or has fewer documents than expected
 */
export async function shouldSeedCollection(collectionName: string, expectedCount: number): Promise<boolean> {
  try {
    const snapshot = await db.collection(collectionName).limit(expectedCount).get();
    const currentCount = snapshot.size;
    const shouldSeed = currentCount < expectedCount;

    logger.info({ collectionName, currentCount, expectedCount, shouldSeed }, "Checked if collection needs seeding");

    return shouldSeed;
  } catch (error) {
    logger.error({ collectionName, error }, "Failed to check collection seed status");
    return true; // Seed on error to be safe
  }
}
