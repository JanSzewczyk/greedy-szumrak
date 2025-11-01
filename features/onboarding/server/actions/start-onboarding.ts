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

export async function startOnboarding(products: ProductsFormData) {
  const { userId } = await auth();
  logger.info({ userId }, "Starting onboarding flow");

  const [, onboarding] = await getOnboardingById(userId ?? "");

  if (!onboarding) {
    logger.info({ userId }, "No existing onboarding found, creating new one");
    const [startOnboardingError, startedOnboarding] = await createOnboardingByUserId(userId ?? "", products);
    if (startOnboardingError) {
      logger.error({ userId, error: startOnboardingError }, "Failed to start onboarding");
      return NextResponse.json({ error: startOnboardingError.message }, { status: 400 });
    }
    logger.info({ userId, onboardingId: startedOnboarding?.id }, "Onboarding created and cookie set");
  } else {
    logger.info({ userId, onboardingId: onboarding.id }, "Existing onboarding found");

    // TODO update onboarding data
  }
  logger.info({ userId }, "Redirecting to preferences step");
  return redirect(OnboardingSteps.PREFERENCES);
}
