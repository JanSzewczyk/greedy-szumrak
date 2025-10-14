"use client";

import { Button } from "@szum-tech/design-system";
import Link from "next/link";
import { StepperContent } from "~/components/ui/v2/stepper-content";

export default function PreferencesPage() {
  return (
    <StepperContent value="/onboarding/preferences">
      Preferences Page
      <Button asChild>
        <Link href="/onboarding/goals">Next</Link>
      </Button>
    </StepperContent>
  );
}
