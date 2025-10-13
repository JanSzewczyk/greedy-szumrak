"use client";

import * as React from "react";

import { CheckIcon, GoalIcon, HeartHandshakeIcon, ListIcon, Settings2Icon } from "lucide-react";

import { usePathname } from "next/navigation";
import { Stepper } from "~/components/ui/stepper/stepper";
import { StepperDescription } from "~/components/ui/stepper/stepper-description";
import { StepperIndicator } from "~/components/ui/stepper/stepper-indicator";
import { StepperItem } from "~/components/ui/stepper/stepper-item";
import { StepperNav } from "~/components/ui/stepper/stepper-nav";
import { StepperPanel } from "~/components/ui/stepper/stepper-panel";
import { StepperTitle } from "~/components/ui/stepper/stepper-title";
import { StepperTrigger } from "~/components/ui/stepper/stepper-trigger";

const steps: Record<string, number> = {
  "/onboarding": 1,
  "/onboarding/preferences": 2,
  "/onboarding/goals": 3,
  "/onboarding/categories": 4
} as const;

export function OnboardingStepper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <Stepper
      indicators={{
        completed: <CheckIcon className="size-4" />
      }}
      value={steps[pathname] || 1}
      onValueChange={(value) => {
        console.log(value);
      }}
    >
      <StepperNav>
        <StepperItem step={1}>
          <StepperTrigger>
            <StepperIndicator>
              <HeartHandshakeIcon className="size-4" />
            </StepperIndicator>
            <StepperTitle>Welcome</StepperTitle>
          </StepperTrigger>
        </StepperItem>

        <StepperItem step={2}>
          <StepperTrigger>
            <StepperIndicator>
              <Settings2Icon className="size-4" />
            </StepperIndicator>
            <div className="flex-1">
              <StepperTitle>Preferences</StepperTitle>
              <StepperDescription>Define your preferences</StepperDescription>
            </div>
          </StepperTrigger>
        </StepperItem>

        <StepperItem step={3}>
          <StepperTrigger>
            <StepperIndicator>
              <GoalIcon className="size-4" />
            </StepperIndicator>
            <div className="flex-1">
              <StepperTitle>Financial Goals</StepperTitle>
              <StepperDescription>Set your monthly targets</StepperDescription>
            </div>
          </StepperTrigger>
        </StepperItem>

        <StepperItem step={4}>
          <StepperTrigger>
            <StepperIndicator>
              <ListIcon className="size-4" />
            </StepperIndicator>
            <div className="flex-1">
              <StepperTitle>Expense Categories</StepperTitle>
              <StepperDescription>Choose your default categories</StepperDescription>
            </div>
          </StepperTrigger>
        </StepperItem>
      </StepperNav>

      <StepperPanel className="mx-auto mt-10 max-w-2xl">{children}</StepperPanel>
    </Stepper>
  );
}
