"use client";

import * as React from "react";

import { GoalIcon, HandshakeIcon, ListIcon, Settings2Icon } from "lucide-react";

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
import { usePathname, useRouter } from "next/navigation";
import { OnboardingSteps } from "~/features/onboarding/types/onboarding";

export function OnboardingStepper({ children, hideNav }: { children: React.ReactNode; hideNav: boolean }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Stepper value={pathname} onValueChange={(value) => router.push(value)}>
      <StepperNav className={hideNav ? "invisible" : ""}>
        <StepperItem value={OnboardingSteps.WELCOME}>
          <StepperTrigger>
            <StepperIndicator>
              <HandshakeIcon className="size-4" />
            </StepperIndicator>
            <StepperTitle>Welcome</StepperTitle>
          </StepperTrigger>
        </StepperItem>
        <StepperItem value={OnboardingSteps.PREFERENCES}>
          <StepperTrigger>
            <StepperIndicator>
              <Settings2Icon className="size-4" />
            </StepperIndicator>
            <div>
              <StepperTitle>Preferences</StepperTitle>
              <StepperDescription>Set Your Preferences</StepperDescription>
            </div>
          </StepperTrigger>
        </StepperItem>
        <StepperItem value={OnboardingSteps.GOALS}>
          <StepperTrigger>
            <StepperIndicator>
              <GoalIcon className="size-4" />
            </StepperIndicator>
            <div>
              <StepperTitle>Goals</StepperTitle>
              <StepperDescription>Review</StepperDescription>
            </div>
          </StepperTrigger>
        </StepperItem>
        <StepperItem value={OnboardingSteps.CATEGORIES}>
          <StepperTrigger>
            <StepperIndicator>
              <ListIcon className="size-4" />
            </StepperIndicator>
            <div>
              <StepperTitle>Categories</StepperTitle>
              <StepperDescription>Review</StepperDescription>
            </div>
          </StepperTrigger>
        </StepperItem>
      </StepperNav>

      <StepperPanel>{children}</StepperPanel>
    </Stepper>
  );
}
