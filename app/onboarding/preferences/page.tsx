"use client";

import { Button } from "@szum-tech/design-system";
import Link from "next/link";
import { StepperContent } from "~/components/ui/stepper/stepper-content";

export default function PreferencesPage() {
  return (
    <StepperContent value={2}>
      Preferences Page
      <Button asChild>
        <Link href="/onboarding/goals">Next</Link>
      </Button>
    </StepperContent>
  );
}
