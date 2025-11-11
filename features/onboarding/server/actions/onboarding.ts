"use server";

import { redirect } from "next/navigation";
import { type PreferencesFormData } from "~/features/onboarding/schema";
import { updateOnboarding } from "~/features/onboarding/server/db/onboarding";
import { type Onboarding, OnboardingSteps, type UpdateOnboardingDto } from "~/features/onboarding/types/onboarding";
import { type RedirectAction } from "~/lib/action-types";
import { createLogger } from "~/lib/logger";
import { setToastCookie } from "~/lib/toast";

const logger = createLogger({ module: "onboarding-actions" });

export async function submitPreferencesStep(formData: PreferencesFormData, onboarding: Onboarding): RedirectAction {
  logger.info({ onboardingId: onboarding.id, formData }, "Submitting preferences step");

  const updateData: UpdateOnboardingDto = {
    currentStep: OnboardingSteps.PREFERENCES,
    preferences: formData
  };

  const [error] = await updateOnboarding(onboarding.id, updateData);
  if (error) {
    logger.error({ onboardingId: onboarding.id, error }, "Failed to update onboarding with preferences");
    return { success: false, error: error.message };
  }

  logger.info({ onboardingId: onboarding.id }, "Preferences saved successfully, redirecting to goals step");

  await setToastCookie("Preferences saved successfully, redirecting to goals step", "success");

  return redirect(OnboardingSteps.GOALS);
}
