import type React from "react";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { OnboardingStepper } from "~/features/onboarding/components/onboarding-stepper";

export default async function OnboardingLayout({ children }: LayoutProps<"/onboarding">) {
  if ((await auth()).sessionClaims?.metadata.onboardingComplete === true) {
    redirect("/");
  }

  return (
    <main className="bg-app-foreground min-h-dvh">
      <div className="container py-20">
        <OnboardingStepper>{children}</OnboardingStepper>
      </div>
    </main>
  );
}
