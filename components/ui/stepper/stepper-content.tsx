import * as React from "react";

import { cn } from "@szum-tech/design-system/utils";
import { useStepper } from "~/components/ui/stepper/stepper.context";

export type StepperContentProps = React.ComponentProps<"div"> & {
  value: number;
  forceMount?: boolean;
};

export function StepperContent({ value, forceMount, children, className }: StepperContentProps) {
  const { activeStep } = useStepper();
  const isActive = value === activeStep;

  if (!forceMount && !isActive) {
    return null;
  }

  return (
    <div
      data-slot="stepper-content"
      data-state={activeStep}
      className={cn("w-full", className, !isActive && forceMount && "hidden")}
      hidden={!isActive && forceMount}
    >
      {children}
    </div>
  );
}
