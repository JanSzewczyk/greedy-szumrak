"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { getOnboardingByUserId, startOnboardingByUserId } from "~/features/onboarding/server/db/onboarding";
import { setOnboardingCookie } from "~/features/onboarding/server/services/onboarding-cookie";
import { type Onboarding, OnboardingSteps } from "~/features/onboarding/types/onboarding";

export async function startOnboarding() {
  const { userId } = await auth();

  const [error, onboardingByUser] = await getOnboardingByUserId(userId ?? "");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (!onboardingByUser) {
    const [startOnboardingError, startedOnboarding] = await startOnboardingByUserId(userId ?? "");
    if (startOnboardingError) {
      return NextResponse.json({ error: startOnboardingError.message }, { status: 400 });
    }
    await setOnboardingCookie(startedOnboarding?.id ?? "");
  }

  return redirect(OnboardingSteps.PREFERENCES);
}

export async function submitPreferencesStep(onboardingId: string, formData: FormData, onboarding: Onboarding) {
  const { userId } = await auth();

  const [error, onboardingByUser] = await getOnboardingByUserId(userId ?? "");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (!onboardingByUser) {
    const [startOnboardingError, startedOnboarding] = await startOnboardingByUserId(userId ?? "");
    if (startOnboardingError) {
      return NextResponse.json({ error: startOnboardingError.message }, { status: 400 });
    }
    await setOnboardingCookie(startedOnboarding?.id ?? "");
  }

  return redirect(OnboardingSteps.PREFERENCES);
}

export async function xxx(onboardingId: string) {}
