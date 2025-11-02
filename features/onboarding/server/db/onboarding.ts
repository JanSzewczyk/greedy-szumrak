import { FieldValue } from "firebase-admin/firestore";
import { type ProductsFormData } from "~/features/onboarding/schema";
import {
  type CreateOnboardingDto,
  type Onboarding,
  OnboardingSteps,
  type UpdateOnboardingDto
} from "~/features/onboarding/types/onboarding";
import { db } from "~/lib/firebase";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "onboarding-db" });

/**
 * Transforms Firestore document data to application Onboarding type
 * Converts Firestore Timestamp objects to JavaScript Date objects
 */
function transformFirestoreToOnboarding(docId: string, data: FirebaseFirestore.DocumentData): Onboarding {
  return {
    id: docId,
    ...data,
    updatedAt: data.updatedAt?.toDate(),
    createdAt: data.createdAt?.toDate()
  } as Onboarding;
}

export async function getOnboardingById(userId: string): Promise<[null, Onboarding] | [Error, null]> {
  try {
    logger.info({ userId }, "Fetching onboarding by userId");

    const onboardingDoc = await db.collection("onboarding").doc(userId).get();

    if (!onboardingDoc.exists) {
      logger.info({ userId }, "Onboarding document not found");
      throw new Error("Onboarding not found.");
    }

    const data = onboardingDoc.data();
    if (!data) {
      throw new Error("Onboarding data is undefined.");
    }

    logger.info({ userId }, "Onboarding document found successfully");
    return [null, transformFirestoreToOnboarding(onboardingDoc.id, data)];
  } catch (error) {
    logger.error({ userId, error }, "Error fetching onboarding by userId");
    return [error as Error, null];
  }
}

export async function createOnboardingByUserId(
  userId: string,
  products: ProductsFormData
): Promise<[null, Onboarding] | [Error, null]> {
  const onboardingData: CreateOnboardingDto = {
    completed: false,
    currentStep: OnboardingSteps.PREFERENCES,
    products,
    updatedAt: FieldValue.serverTimestamp(),
    createdAt: FieldValue.serverTimestamp()
  };

  try {
    logger.info({ userId }, "Starting onboarding by userId");

    const onboardingDocRef = db.collection("onboarding").doc(userId);
    await onboardingDocRef.create(onboardingData);
    logger.info({ onboardingId: onboardingDocRef.id }, "Onboarding document created successfully");

    const createdDoc = await onboardingDocRef.get();
    if (!createdDoc.exists) {
      logger.warn({ onboardingId: onboardingDocRef.id }, "Onboarding document not found");
      throw new Error("Onboarding not found.");
    }

    const data = createdDoc.data();
    if (!data) {
      throw new Error("Onboarding data is undefined.");
    }

    return [null, transformFirestoreToOnboarding(createdDoc.id, data)];
  } catch (error) {
    logger.error({ userId, error }, "Error starting onboarding");
    return [error as Error, null];
  }
}

export async function updateOnboarding(
  onboardingId: string,
  updateData: UpdateOnboardingDto
): Promise<[null, Onboarding] | [Error, null]> {
  try {
    logger.info({ onboardingId, updateData }, "Updating onboarding by onboardingId");

    const onboardingDocRef = db.collection("onboarding").doc(onboardingId);
    await onboardingDocRef.update({
      ...updateData,
      updatedAt: FieldValue.serverTimestamp()
    });

    const updatedDoc = await onboardingDocRef.get();
    if (!updatedDoc.exists) {
      throw new Error("Onboarding not found after update.");
    }

    const data = updatedDoc.data();
    if (!data) {
      throw new Error("Onboarding data is undefined.");
    }

    logger.info({ onboardingId }, "Onboarding document updated successfully");
    return [null, transformFirestoreToOnboarding(updatedDoc.id, data)];
  } catch (error) {
    logger.error({ onboardingId, error }, "Error updating onboarding");
    return [error as Error, null];
  }
}
