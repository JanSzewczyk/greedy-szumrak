"use client";

import { Button, StepperContent } from "@szum-tech/design-system";
import Link from "next/link";

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
