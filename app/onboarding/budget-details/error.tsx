"use client";

import { useEffect } from "react";

import { Button, StepperContent } from "@szum-tech/design-system";
import { useRouter } from "next/navigation";
import { OnboardingSteps } from "~/features/onboarding/types/onboarding";
import logger from "~/lib/logger";

export default function BudgetDetailsError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    logger.error(
      {
        error: {
          message: error.message,
          stack: error.stack,
          digest: error.digest
        },
        page: "budget-details"
      },
      "Budget details page error occurred"
    );
  }, [error]);

  return (
    <StepperContent value={OnboardingSteps.BUDGET_DETAILS}>
      <div className="flex flex-col items-center justify-center gap-6 py-12">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold">Something went wrong</h2>
          <p className="text-muted-foreground">We encountered an error while loading your budget details.</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => reset()}>Try again</Button>
          <Button variant="outline" onClick={() => router.push(OnboardingSteps.BUDGET_SETUP)}>
            Go back to budget setup
          </Button>
        </div>
      </div>
    </StepperContent>
  );
}
