"use client";

import * as React from "react";

import { GoalIcon, HeartHandshakeIcon, ListIcon, Settings2Icon } from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Stepper } from "~/components/ui/v2/stepper";
import { StepperDescription } from "~/components/ui/v2/stepper-description";
import { StepperIndicator } from "~/components/ui/v2/stepper-indicator";
import { StepperItem } from "~/components/ui/v2/stepper-item";
import { StepperNav } from "~/components/ui/v2/stepper-nav";
import { StepperPanel } from "~/components/ui/v2/stepper-panel";
import { StepperTitle } from "~/components/ui/v2/stepper-title";
import { StepperTrigger } from "~/components/ui/v2/stepper-trigger";

export function OnboardingStepper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <Stepper
      // indicators={{
      //   completed: <CheckIcon className="size-4" />
      // }}
      value={pathname}
    >
      <StepperNav>
        <StepperItem value={"/onboarding"}>
          <StepperTrigger asChild>
            <Link href="/onboarding">
              <StepperIndicator>
                <HeartHandshakeIcon className="size-4" />
              </StepperIndicator>
              <StepperTitle>Welcome</StepperTitle>
            </Link>
          </StepperTrigger>
        </StepperItem>

        <StepperItem value={"/onboarding/preferences"}>
          <StepperTrigger asChild>
            <Link href="/onboarding/preferences">
              <StepperIndicator>
                <Settings2Icon className="size-4" />
              </StepperIndicator>
              <div className="flex-1">
                <StepperTitle>Preferences</StepperTitle>
                <StepperDescription>Define your preferences</StepperDescription>
              </div>
            </Link>
          </StepperTrigger>
        </StepperItem>

        <StepperItem value="/onboarding/goals">
          <StepperTrigger asChild>
            <Link href="/onboarding/goals">
              <StepperIndicator>
                <GoalIcon className="size-4" />
              </StepperIndicator>
              <div className="flex-1">
                <StepperTitle>Financial Goals</StepperTitle>
                <StepperDescription>Set your monthly targets</StepperDescription>
              </div>
            </Link>
          </StepperTrigger>
        </StepperItem>

        <StepperItem value="/onboarding/categories">
          <StepperTrigger asChild>
            <Link href="/onboarding/categories">
              <StepperIndicator>
                <ListIcon className="size-4" />
              </StepperIndicator>
              <div className="flex-1">
                <StepperTitle>Expense Categories</StepperTitle>
                <StepperDescription>Choose your default categories</StepperDescription>
              </div>
            </Link>
          </StepperTrigger>
        </StepperItem>
      </StepperNav>

      <StepperPanel className="mx-auto mt-10 max-w-2xl">{children}</StepperPanel>
    </Stepper>
  );
}
