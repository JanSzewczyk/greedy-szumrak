"use client";

import * as React from "react";

import { Button, Input } from "@szum-tech/design-system";
import Link from "next/link";
import { StepperContent } from "~/components/ui/stepper/stepper-content";

export default function OnboardingComponent() {
  return (
    <StepperContent value={1}>
      <form>
        <Input name={"name"} placeholder={"Name"} />
      </form>
      <Button asChild>
        <Link href="/onboarding/preferences">Next</Link>
      </Button>
    </StepperContent>
  );
}
