"use server";

import { redirect } from "next/navigation";
import { type BudgetSetupFormData } from "~/features/onboarding/schemas/budget-setup";
import { updateOnboarding } from "~/features/onboarding/server/db/onboarding";
import { type Onboarding, OnboardingSteps, type UpdateOnboardingDto } from "~/features/onboarding/types/onboarding";
import { type RedirectAction } from "~/lib/action-types";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "onboarding-actions" });

export async function submitBudgetConfiguration(formData: BudgetSetupFormData, onboarding: Onboarding): RedirectAction {
  logger.info({ onboardingId: onboarding.id, formData }, "Submitting budget configuration");

  let updateData: UpdateOnboardingDto = {
    currentStep: OnboardingSteps.BUDGET_DETAILS,
    budget: formData
  };

  if (
    onboarding.budgetDetails &&
    onboarding.budget?.budgetProfile &&
    onboarding.budget?.budgetProfile !== formData.budgetProfile
  ) {
    logger.info({ onboardingId: onboarding.id }, "Reset budget details when budget profile changes");
    updateData = {
      ...updateData,
      budgetDetails: null
    };
  }

  const [error] = await updateOnboarding(onboarding.id, updateData);
  if (error) {
    logger.error({ onboardingId: onboarding.id, error }, "Failed to update onboarding with budget configuration");
    return { success: false, error: error.message };
  }

  logger.info(
    { onboardingId: onboarding.id },
    "Budget configuration saved successfully, redirecting to budget details step"
  );

  return redirect(OnboardingSteps.BUDGET_DETAILS);
}
