import React from "react";

import { cn } from "@szum-tech/design-system/utils";
import { StepItemContext, useStepper } from "~/components/ui/stepper/stepper.context";
import { StepState } from "~/components/ui/stepper/stepper.types";

export type StepperItemProps = React.HTMLAttributes<HTMLDivElement> & {
  step: number;
  completed?: boolean;
  disabled?: boolean;
  loading?: boolean;
};

export function StepperItem({
  step,
  completed = false,
  disabled = false,
  loading = false,
  className,
  children,
  ...props
}: StepperItemProps) {
  const { activeStep } = useStepper();

  const state: StepState =
    completed || step < activeStep ? StepState.COMPLETE : activeStep === step ? StepState.ACTIVE : StepState.INACTIVE;
  const isLoading = loading && step === activeStep;

  return (
    <StepItemContext.Provider value={{ step, state, isDisabled: disabled, isLoading }}>
      <div
        data-slot="stepper-item"
        className={cn(
          "group/step flex flex-1 flex-col items-center justify-center",
          "",
          // "group-data-[orientation=horizontal]/stepper-nav:flex-row group-data-[orientation=vertical]/stepper-nav:flex-col",
          className
        )}
        data-state={state}
        {...(isLoading ? { "data-loading": true } : {})}
        {...props}
      >
        {children}

        <div
          data-state={state}
          className={cn(
            "h-1 w-full bg-gray-800 transition-colors duration-300",
            "data-[state=active]:bg-primary-500 data-[state=completed]:bg-success-500",
            ""
          )}
        />
      </div>
    </StepItemContext.Provider>
  );
}
