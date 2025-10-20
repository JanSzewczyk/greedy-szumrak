"use server";

import "server-only";
import { cookies } from "next/headers";
import { env } from "~/data/env/server";

const ONBOARDING_COOKIE_NAME = "onboarding" as const;

export async function setOnboardingCookie(onboardingId: string) {
  const cookieStore = await cookies();
  cookieStore.set(ONBOARDING_COOKIE_NAME, onboardingId, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax"
  });
}

export async function getOnboardingCookie() {
  const cookieStore = await cookies();
  const onboardingId = cookieStore.get(ONBOARDING_COOKIE_NAME)?.value ?? "";

  return { onboardingId };
}

export async function deleteOnboardingCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(ONBOARDING_COOKIE_NAME);
}
