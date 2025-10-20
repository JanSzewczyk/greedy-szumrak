import { collection, doc, getDoc, getDocs, query, where, addDoc } from "@firebase/firestore";
import { type Onboarding, OnboardingSteps } from "~/features/onboarding/types/onboarding";
import { db } from "~/lib/firebase";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "onboarding-db" });

export async function getOnboardingByUserId(userId: string): Promise<[null, Onboarding | null] | [Error, null]> {
  try {
    logger.info({ userId }, "Fetching onboarding by userId");

    const onboardingRef = collection(db, "onboarding");
    const onboardingQuery = query(onboardingRef, where("userId", "==", userId));

    const querySnapshot = await getDocs(onboardingQuery);

    if (querySnapshot.empty) {
      logger.info({ userId }, "No onboarding document found for userId");
      return [null, null];
    }

    const onboardingDocs = querySnapshot.docs;
    if (onboardingDocs.length > 1) {
      logger.error({ userId, count: onboardingDocs.length }, "Multiple onboarding documents found for the same user");
      throw new Error("Multiple onboarding documents found for the same user.");
    }

    const doc = querySnapshot.docs[0];
    logger.info({ userId, onboardingId: doc?.id }, "Onboarding document found successfully");
    return [null, { id: doc?.id, ...doc?.data() } as unknown as Onboarding];
  } catch (error) {
    logger.error({ userId, error }, "Error fetching onboarding by userId");
    return [error as Error, null];
  }
}

export async function getOnboardingByOnboardingId(onboardingId: string): Promise<[null, Onboarding] | [Error, null]> {
  try {
    logger.info({ onboardingId }, "Fetching onboarding by onboardingId");

    const onboardingRef = doc(db, "onboarding", onboardingId);
    const onboardingDoc = await getDoc(onboardingRef);

    if (!onboardingDoc.exists()) {
      logger.info({ onboardingId }, "Onboarding document not found");
      throw new Error("Onboarding not found.");
    }

    logger.info({ onboardingId }, "Onboarding document found successfully");
    return [null, { id: onboardingDoc?.id, ...onboardingDoc?.data() } as unknown as Onboarding];
  } catch (error) {
    logger.error({ onboardingId, error }, "Error fetching onboarding by onboardingId");
    return [error as Error, null];
  }
}

export async function startOnboardingByUserId(userId: string): Promise<[null, Onboarding] | [Error, null]> {
  const onboardingData: Onboarding = {
    userId,
    completed: false,
    currentStep: OnboardingSteps.PREFERENCES,
    preferences: {
      currency: null,
      language: null
    },
    goals: {
      budget: null,
      savings: null,
      investmentTarget: null
    },
    expenses: {
      categories: []
    }
  };

  try {
    logger.info({ userId }, "Starting onboarding by userId");

    const onboardingCollectionRef = collection(db, "onboarding");
    const onboardingDoc = await addDoc(onboardingCollectionRef, onboardingData);

    logger.info({ onboardingId: onboardingDoc.id }, "Onboarding document created successfully");

    return [null, { id: onboardingDoc?.id, ...onboardingData } as unknown as Onboarding];
  } catch (error) {
    logger.error({ userId, error }, "Error starting onboarding");
    return [error as Error, null];
  }
}
