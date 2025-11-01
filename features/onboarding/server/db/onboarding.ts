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

export async function getOnboardingById(userId: string): Promise<[null, Onboarding] | [Error, null]> {
  try {
    logger.info({ userId }, "Fetching onboarding by userId");

    const onboardingDoc = await db.collection("onboarding").doc(userId).get();

    if (!onboardingDoc.exists) {
      logger.info({ userId }, "Onboarding document not found");
      throw new Error("Onboarding not found.");
    }

    logger.info({ userId }, "Onboarding document found successfully");
    return [
      null,
      {
        id: onboardingDoc.id,
        ...onboardingDoc.data(),
        updatedAt: onboardingDoc.data()?.createdAt?.toDate(),
        createdAt: onboardingDoc.data()?.createdAt?.toDate()
      } as unknown as Onboarding
    ];
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

    return [
      null,
      {
        id: createdDoc.id,
        ...createdDoc.data(),
        updatedAt: createdDoc.data()?.createdAt?.toDate(),
        createdAt: createdDoc.data()?.createdAt?.toDate()
      } as unknown as Onboarding
    ];
  } catch (error) {
    logger.error({ userId, error }, "Error starting onboarding");
    return [error as Error, null];
  }
}

export async function updateOnboarding(
  onboardingId: string,
  onboardingData: Onboarding
): Promise<[null, Onboarding] | [Error, null]> {
  try {
    logger.info({ onboardingId, onboardingData }, "Updating onboarding by onboardingId");

    const onboardingDocRef = db.collection("onboarding").doc(onboardingId);
    await onboardingDocRef.update(onboardingData);
    const updatedDoc = await onboardingDocRef.get();

    logger.info({ onboardingId }, "Onboarding document updated successfully");
    return [
      null,
      {
        id: updatedDoc.id,
        ...updatedDoc.data(),
        updatedAt: updatedDoc.data()?.createdAt?.toDate(),
        createdAt: updatedDoc.data()?.createdAt?.toDate()
      } as unknown as Onboarding
    ];
  } catch (error) {
    logger.error({ onboardingId, error }, "Error updating onboarding");
    return [error as Error, null];
  }
}
