"use server";

import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { type PreferencesFormData } from "~/features/onboarding/schema";
import { updateOnboarding } from "~/features/onboarding/server/db/onboarding";
import { type Onboarding, OnboardingSteps, type UpdateOnboardingDto } from "~/features/onboarding/types/onboarding";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "onboarding-actions" });

export async function submitPreferencesStep(formData: PreferencesFormData, onboarding: Onboarding) {
  logger.info({ onboardingId: onboarding.id, formData }, "Submitting preferences step");

  const updateData: UpdateOnboardingDto = {
    currentStep: OnboardingSteps.PREFERENCES,
    preferences: formData
  };

  const [error] = await updateOnboarding(onboarding.id, updateData);
  if (error) {
    logger.error({ onboardingId: onboarding.id, error }, "Failed to update onboarding with preferences");
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  logger.info({ onboardingId: onboarding.id }, "Preferences saved successfully, redirecting to goals step");
  return redirect(OnboardingSteps.GOALS);
}
