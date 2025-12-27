"use server";

import { redirect } from "next/navigation";
import { updateOnboarding } from "~/features/onboarding/server/db/onboarding";
import {
  type Onboarding,
  type OnboardingInvestment,
  OnboardingSteps,
  type UpdateOnboardingDto
} from "~/features/onboarding/types/onboarding";
import { type RedirectAction } from "~/lib/action-types";
import { createLogger } from "~/lib/logger";
import { setToastCookie } from "~/lib/toast/server/toast.cookie";

const logger = createLogger({ module: "onboarding-actions" });

/**
 * Server action to submit the investments step
 * Saves investment accounts and redirects to the next step (COMPLETE)
 */
export async function submitInvestments(formData: Array<OnboardingInvestment>, onboarding: Onboarding): RedirectAction {
  logger.info({ onboardingId: onboarding.id, accountCount: formData.length }, "Submitting investments step");

  const updateData: UpdateOnboardingDto = {
    currentStep: OnboardingSteps.COMPLETE,
    investments: formData
  };

  const [error] = await updateOnboarding(onboarding.id, updateData);
  if (error) {
    logger.error(
      {
        onboardingId: onboarding.id,
        errorCode: error.code,
        isRetryable: error.isRetryable
      },
      "Failed to update onboarding with investments"
    );
    await setToastCookie("Failed to save investment accounts. Please try again.", "error");
    return { success: false, error: error.message };
  }

  logger.info({ onboardingId: onboarding.id }, "Investments saved successfully, redirecting to complete step");

  await setToastCookie("Investment accounts saved successfully!", "success");
  return redirect(OnboardingSteps.COMPLETE);
}

/**
 * Server action to skip the investments step
 * Saves empty investments array and redirects to the next step (COMPLETE)
 */
export async function skipInvestments(onboarding: Onboarding): RedirectAction {
  logger.info({ onboardingId: onboarding.id }, "Skipping investments step");

  const updateData: UpdateOnboardingDto = {
    currentStep: OnboardingSteps.COMPLETE,
    investments: []
  };

  const [error] = await updateOnboarding(onboarding.id, updateData);
  if (error) {
    logger.error(
      {
        onboardingId: onboarding.id,
        errorCode: error.code,
        isRetryable: error.isRetryable
      },
      "Failed to skip investments step"
    );
    await setToastCookie("Failed to skip investments step. Please try again.", "error");
    return { success: false, error: error.message };
  }

  logger.info({ onboardingId: onboarding.id }, "Investments step skipped, redirecting to complete step");

  await setToastCookie("Investments step skipped. You can add accounts later.", "info");
  return redirect(OnboardingSteps.COMPLETE);
}
