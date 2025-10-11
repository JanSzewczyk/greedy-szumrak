import React from "react";

import { cn } from "@szum-tech/design-system/utils";
import { useStepper } from "~/components/ui/stepper/stepper.context";

export type StepperPanelProps = React.ComponentProps<"div">;

export function StepperPanel({ children, className }: StepperPanelProps) {
  const { activeStep } = useStepper();
  return (
    <div data-slot="stepper-panel" data-state={activeStep} className={cn("w-full", className)}>
      {children}
    </div>
  );
}
