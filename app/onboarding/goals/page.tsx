"use client";

import { Button } from "@szum-tech/design-system";
import Link from "next/link";
import { StepperContent } from "../../../../design-system/src/components/stepper/stepper-content";

export default function GoalsPage() {
  return (
    <StepperContent value="/onboarding/goals">
      Financials Goals Step
      <Button asChild>
        <Link href="/onboarding/categories">Next</Link>
      </Button>
    </StepperContent>
  );
}
