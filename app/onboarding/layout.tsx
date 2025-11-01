import type React from "react";

import { auth } from "@clerk/nextjs/server";
import { redirect, unauthorized } from "next/navigation";
import { OnboardingStepper } from "~/features/onboarding/components/onboarding-stepper";
import { getOnboardingById } from "~/features/onboarding/server/db/onboarding";
import logger from "~/lib/logger";

async function loadData() {
  const { userId, isAuthenticated, sessionClaims } = await auth();

  if (!isAuthenticated) {
    logger.warn("User is not authenticated");
    return unauthorized();
  }

  if (sessionClaims?.metadata.onboardingComplete === true) {
    logger.info("User is already onboarded, redirecting to dashboard page");
    redirect("/");
  }

  const [, onboarding] = await getOnboardingById(userId);
  logger.info("Onboarding layout loaded");

  return { onboarding };
}

export default async function OnboardingLayout({ children }: LayoutProps<"/onboarding">) {
  const { onboarding } = await loadData();

  return (
    <main className="bg-app-foreground min-h-dvh">
      <div className="container py-20">
        <h1 className="text-heading-h3 mb-8">Greedy Szumrak</h1>
        <OnboardingStepper hideNav={!onboarding}>{children}</OnboardingStepper>
      </div>
    </main>
  );
}
