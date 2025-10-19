"use client";

import * as React from "react";

import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperTitle,
  StepperTrigger
} from "@szum-tech/design-system";
import { usePathname } from "next/navigation";

export function OnboardingStepper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <Stepper value={pathname} onValueChange={(value) => console.log("value", value)}>
      <StepperNav>
        <StepperItem value="/onboarding">
          <StepperTrigger>
            <StepperIndicator />
            <div>
              <StepperTitle>Welcome</StepperTitle>
              <StepperDescription>Basic Information</StepperDescription>
            </div>
          </StepperTrigger>
        </StepperItem>
        <StepperItem value="/onboarding/preferences">
          <StepperTrigger>
            <StepperIndicator />
            <div>
              <StepperTitle>Preferences</StepperTitle>
              <StepperDescription>Details</StepperDescription>
            </div>
          </StepperTrigger>
        </StepperItem>
        <StepperItem value="/onboarding/goals">
          <StepperTrigger>
            <StepperIndicator />
            <div>
              <StepperTitle>Goals</StepperTitle>
              <StepperDescription>Review</StepperDescription>
            </div>
          </StepperTrigger>
        </StepperItem>
        <StepperItem value="/onboarding/categories">
          <StepperTrigger>
            <StepperIndicator />
            <div>
              <StepperTitle>Goals</StepperTitle>
              <StepperDescription>Review</StepperDescription>
            </div>
          </StepperTrigger>
        </StepperItem>
      </StepperNav>

      <StepperPanel>{children}</StepperPanel>
    </Stepper>
  );
}
