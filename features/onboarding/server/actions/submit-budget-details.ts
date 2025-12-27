"use server";

import { redirect } from "next/navigation";
import { type BudgetDetailsFormData } from "~/features/onboarding/schemas/budget-details";
import { updateOnboarding } from "~/features/onboarding/server/db/onboarding";
import { type Onboarding, OnboardingSteps, type UpdateOnboardingDto } from "~/features/onboarding/types/onboarding";
import { type RedirectAction } from "~/lib/action-types";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "onboarding-actions" });

export async function submitBudgetDetails(formData: BudgetDetailsFormData, onboarding: Onboarding): RedirectAction {
  logger.info({ onboardingId: onboarding.id, formData }, "Submitting budget details");

  const updateData: UpdateOnboardingDto = {
    currentStep: OnboardingSteps.BUDGET_DETAILS,
    budgetDetails: formData
  };

  const [error, updatedOnboarding] = await updateOnboarding(onboarding.id, updateData);
  if (error) {
    logger.error({ onboardingId: onboarding.id, error }, "Failed to update onboarding with budget details");
    return { success: false, error: error.message };
  }

  logger.info(
    { onboardingId: updatedOnboarding.id },
    "Budget details saved successfully, redirecting to investments step"
  );

  return redirect(OnboardingSteps.INVESTMENTS);
}
