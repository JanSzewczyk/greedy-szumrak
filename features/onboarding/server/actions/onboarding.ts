"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { type PreferencesFormData, type ProductsFormData } from "~/features/onboarding/schema";
import {
  createOnboardingByUserId,
  getOnboardingById,
  updateOnboarding
} from "~/features/onboarding/server/db/onboarding";
import { type Onboarding, OnboardingSteps, type UpdateOnboardingDto } from "~/features/onboarding/types/onboarding";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "onboarding-actions" });

export async function submitPreferencesStep(formData: PreferencesFormData, onboarding: Onboarding) {
  logger.info({ onboardingId: onboarding.id, formData }, "Submitting preferences step");

  const updatedOnboarding: Onboarding = {
    ...onboarding,
    currentStep: OnboardingSteps.PREFERENCES,
    preferences: formData
  };

  const [error] = await updateOnboarding(onboarding.id, updatedOnboarding);
  if (error) {
    logger.error({ onboardingId: onboarding.id, error }, "Failed to update onboarding with preferences");
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  logger.info({ onboardingId: onboarding.id }, "Preferences saved successfully, redirecting to goals step");
  return redirect(OnboardingSteps.GOALS);
}
