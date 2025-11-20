"use server";

import { redirect } from "next/navigation";
import { type PreferencesFormData } from "~/features/onboarding/schema";
import { updateOnboarding } from "~/features/onboarding/server/db/onboarding";
import { type Onboarding, OnboardingSteps, type UpdateOnboardingDto } from "~/features/onboarding/types/onboarding";
import { type RedirectAction } from "~/lib/action-types";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "onboarding-actions" });

export async function submitPreferences(formData: PreferencesFormData, onboarding: Onboarding): RedirectAction {
  logger.info({ onboardingId: onboarding.id, formData }, "Submitting preferences step");

  const updateData: UpdateOnboardingDto = {
    currentStep: OnboardingSteps.SET_UP_BUDGET,
    preferences: formData
  };

  const [error] = await updateOnboarding(onboarding.id, updateData);
  if (error) {
    logger.error({ onboardingId: onboarding.id, error }, "Failed to update onboarding with preferences");
    return { success: false, error: error.message };
  }

  logger.info({ onboardingId: onboarding.id }, "Preferences saved successfully, redirecting to goals step");

  return redirect(OnboardingSteps.SET_UP_BUDGET);
}
