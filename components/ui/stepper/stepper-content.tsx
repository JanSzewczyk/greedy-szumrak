import * as React from "react";

import { cn } from "@szum-tech/design-system/utils";
import { useStepper } from "~/components/ui/stepper/stepper.context";
import { useValidationLog } from "~/components/ui/stepper/use-validation-log";

export type StepperContentProps = React.ComponentProps<"div"> & {
  value: number;
  forceMount?: boolean;
};

export function StepperContent({ value, forceMount, children, className }: StepperContentProps) {
  const { activeStep, steps, isMounted } = useStepper();

  useValidationLog({
    scope: "StepperContent",
    check: !isMounted || (isMounted && steps.includes(value)),
    message: `Invalid value. Value "${value}" does not exist in the list of available steps: [${steps.join(", ")}]`
  });

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
