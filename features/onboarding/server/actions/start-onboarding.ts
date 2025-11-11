"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { type ProductsFormData } from "~/features/onboarding/schema";
import {
  createOnboardingByUserId,
  getOnboardingById,
  updateOnboarding
} from "~/features/onboarding/server/db/onboarding";
import { OnboardingSteps, type UpdateOnboardingDto } from "~/features/onboarding/types/onboarding";
import { type RedirectAction } from "~/lib/action-types";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "onboarding-actions" });

export async function startOnboarding(products: ProductsFormData): RedirectAction {
  const { userId } = await auth();
  logger.info({ userId }, "Starting onboarding flow");

  const [, onboarding] = await getOnboardingById(userId ?? "");

  if (!onboarding) {
    logger.info({ userId }, "No existing onboarding found, creating new one");
    const [startOnboardingError, startedOnboarding] = await createOnboardingByUserId(userId ?? "", products);
    if (startOnboardingError) {
      logger.error({ userId, error: startOnboardingError }, "Failed to start onboarding");
      return { success: false, error: "Failed to start onboarding" };
    }
    logger.info({ userId, onboardingId: startedOnboarding?.id }, "Onboarding created and cookie set");
  } else {
    logger.info({ userId, onboardingId: onboarding.id }, "Existing onboarding found");

    const updateData: UpdateOnboardingDto = {
      currentStep: OnboardingSteps.PREFERENCES,
      products
    };

    const [error] = await updateOnboarding(onboarding.id, updateData);
    if (error) {
      logger.error({ onboardingId: onboarding.id, error }, "Failed to update onboarding with preferences");
      return { success: false, error: error.message };
    }
  }
  logger.info({ userId }, "Redirecting to preferences step");
  return redirect(OnboardingSteps.PREFERENCES);
}
