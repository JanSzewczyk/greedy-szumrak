import { FieldValue } from "firebase-admin/firestore";
import {
  type CreateOnboardingDto,
  type Onboarding,
  type OnboardingProducts,
  OnboardingSteps,
  type UpdateOnboardingDto
} from "~/features/onboarding/types/onboarding";
import { db } from "~/lib/firebase";
import { categorizeDbError, DbError } from "~/lib/firebase/errors";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "onboarding-db" });
const COLLECTION_NAME = "onboarding";
const RESOURCE_NAME = "Onboarding";

/**
 * Transforms Firestore document data to application Onboarding type
 * Converts Firestore Timestamp objects to JavaScript Date objects
 */
function transformFirestoreToOnboarding(docId: string, data: FirebaseFirestore.DocumentData): Onboarding {
  return {
    id: docId,
    ...data,
    completedAt: data.completedAt?.toDate() ?? null,
    updatedAt: data.updatedAt?.toDate(),
    createdAt: data.createdAt?.toDate()
  } as Onboarding;
}

export async function getOnboardingById(userId: string): Promise<[null, Onboarding] | [DbError, null]> {
  // Input validation
  if (!userId || userId.trim() === "") {
    const error = DbError.validation("Invalid userId provided");
    logger.warn({ userId, error }, "Invalid userId provided");
    return [error, null];
  }

  try {
    logger.info({ userId }, "Fetching onboarding by userId");

    const onboardingDoc = await db.collection(COLLECTION_NAME).doc(userId).get();

    if (!onboardingDoc.exists) {
      const error = DbError.notFound(RESOURCE_NAME);
      logger.warn({ userId, error }, "Onboarding document not found");
      return [error, null];
    }

    const data = onboardingDoc.data();
    if (!data) {
      const error = DbError.dataCorruption(RESOURCE_NAME);
      logger.error({ userId, error }, "Onboarding document exists but data is undefined");
      return [error, null];
    }

    logger.info({ userId }, "Onboarding document found successfully");
    return [null, transformFirestoreToOnboarding(onboardingDoc.id, data)];
  } catch (error) {
    const dbError = categorizeDbError(error, RESOURCE_NAME);
    logger.error(
      {
        userId,
        error
      },
      "Error fetching onboarding by userId"
    );
    return [dbError, null];
  }
}

export async function createOnboardingByUserId(
  userId: string,
  products: OnboardingProducts
): Promise<[null, Onboarding] | [DbError, null]> {
  // Input validation
  if (!userId || userId.trim() === "") {
    const error = DbError.validation("Invalid userId provided");
    logger.warn({ userId, error }, "Invalid userId provided for create");
    return [error, null];
  }

  const onboardingData: CreateOnboardingDto = {
    completed: false,
    completedAt: null,
    currentStep: OnboardingSteps.PREFERENCES,
    products,
    updatedAt: FieldValue.serverTimestamp(),
    createdAt: FieldValue.serverTimestamp()
  };

  try {
    logger.info({ userId }, "Creating onboarding by userId");

    const onboardingDocRef = db.collection(COLLECTION_NAME).doc(userId);
    await onboardingDocRef.create(onboardingData);
    logger.info({ onboardingId: onboardingDocRef.id }, "Onboarding document created successfully");

    const createdDoc = await onboardingDocRef.get();
    if (!createdDoc.exists) {
      const error = DbError.notFound(RESOURCE_NAME);
      logger.error({ onboardingId: onboardingDocRef.id, error }, "Onboarding document not found after create");
      return [error, null];
    }

    const data = createdDoc.data();
    if (!data) {
      const error = DbError.dataCorruption(RESOURCE_NAME);
      logger.error({ onboardingId: onboardingDocRef.id, error }, "Onboarding data undefined after create");
      return [error, null];
    }

    return [null, transformFirestoreToOnboarding(createdDoc.id, data)];
  } catch (error) {
    const dbError = categorizeDbError(error, RESOURCE_NAME);
    logger.error(
      {
        userId,
        error
      },
      "Error creating onboarding"
    );
    return [dbError, null];
  }
}

export async function updateOnboarding(
  onboardingId: string,
  updateData: UpdateOnboardingDto
): Promise<[null, Onboarding] | [DbError, null]> {
  // Input validation
  if (!onboardingId || onboardingId.trim() === "") {
    const error = DbError.validation("Invalid onboardingId provided");
    logger.warn({ onboardingId, error }, "Invalid onboardingId provided for update");
    return [error, null];
  }

  try {
    logger.info({ onboardingId, updateData }, "Updating onboarding by onboardingId");

    const onboardingDocRef = db.collection(COLLECTION_NAME).doc(onboardingId);
    await onboardingDocRef.update({
      ...updateData,
      updatedAt: FieldValue.serverTimestamp()
    });

    const updatedDoc = await onboardingDocRef.get();
    if (!updatedDoc.exists) {
      const error = DbError.notFound(RESOURCE_NAME);
      logger.error({ onboardingId, error }, "Onboarding document not found after update");
      return [error, null];
    }

    const data = updatedDoc.data();
    if (!data) {
      const error = DbError.dataCorruption(RESOURCE_NAME);
      logger.error({ onboardingId, error }, "Onboarding data undefined after update");
      return [error, null];
    }

    logger.info({ onboardingId }, "Onboarding document updated successfully");
    return [null, transformFirestoreToOnboarding(updatedDoc.id, data)];
  } catch (error) {
    const dbError = categorizeDbError(error, RESOURCE_NAME);
    logger.error(
      {
        onboardingId,
        error
      },
      "Error updating onboarding"
    );
    return [dbError, null];
  }
}
