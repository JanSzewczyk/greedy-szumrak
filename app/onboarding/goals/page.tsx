"use client";

import { Button, StepperContent } from "@szum-tech/design-system";
import Link from "next/link";

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
