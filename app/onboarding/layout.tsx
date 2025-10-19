import type React from "react";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { OnboardingStepper } from "~/features/onboarding/components/onboarding-stepper";
import logger from "~/lib/logger";

export default async function OnboardingLayout({ children }: LayoutProps<"/onboarding">) {
  if ((await auth()).sessionClaims?.metadata.onboardingComplete === true) {
    logger.info("User is already onboarded, redirecting to dashboard page");
    redirect("/");
  }

  return (
    <main className="bg-app-foreground min-h-dvh">
      <div className="container py-20">
        <h1 className="text-heading-4 mb-8">Greedy Szumrak</h1>
        <OnboardingStepper>{children}</OnboardingStepper>
      </div>
    </main>
  );
}
