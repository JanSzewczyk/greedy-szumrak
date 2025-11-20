"use server";

import { redirect } from "next/navigation";
import { updateOnboarding } from "~/features/onboarding/server/db/onboarding";
import { type BudgetChooseTemplateFormData } from "~/features/onboarding/shemas/set-up-budget";
import { type Onboarding, OnboardingSteps, type UpdateOnboardingDto } from "~/features/onboarding/types/onboarding";
import { type RedirectAction } from "~/lib/action-types";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "onboarding-actions" });

export async function submitBudgetConfiguration(
  formData: BudgetChooseTemplateFormData,
  onboarding: Onboarding
): RedirectAction {
  logger.info({ onboardingId: onboarding.id, formData }, "Submitting budget configuration");

  const updateData: UpdateOnboardingDto = {
    currentStep: OnboardingSteps.SET_UP_BUDGET,
    budget: formData
  };

  const [error] = await updateOnboarding(onboarding.id, updateData);
  if (error) {
    logger.error({ onboardingId: onboarding.id, error }, "Failed to update onboarding with budget configuration");
    return { success: false, error: error.message };
  }

  logger.info({ onboardingId: onboarding.id }, "Budget configuration saved successfully, redirecting to budget step");

  return redirect(OnboardingSteps.BUDGET);
}
