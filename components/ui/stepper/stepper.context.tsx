import * as React from "react";

import {
  type StepIndicators,
  type StepperOrientation,
  type StepperStep,
  type StepState
} from "~/components/ui/stepper/stepper.types";

export type StepperContextValue = {
  activeStep: number;
  setActiveStep: (step: number) => void;
  stepsCount: number;
  orientation: StepperOrientation;
  registerTrigger: (node: HTMLButtonElement | null) => void;
  triggerNodes: HTMLButtonElement[];
  focusNext: (currentIdx: number) => void;
  focusPrev: (currentIdx: number) => void;
  focusFirst: () => void;
  focusLast: () => void;
  indicators: StepIndicators;
  steps: Array<StepperStep>;
  isMounted: boolean;
};

export type StepItemContextValue = {
  step: number;
  state: StepState;
  isDisabled: boolean;
  isLoading: boolean;
};

export const StepperContext = React.createContext<StepperContextValue | undefined>(undefined);
export const StepItemContext = React.createContext<StepItemContextValue | undefined>(undefined);

export function useStepper() {
  const ctx = React.useContext(StepperContext);
  if (!ctx) throw new Error("useStepper must be used within a Stepper");
  return ctx;
}

export function useStepItem() {
  const ctx = React.useContext(StepItemContext);
  if (!ctx) throw new Error("useStepItem must be used within a StepperItem");
  return ctx;
}
