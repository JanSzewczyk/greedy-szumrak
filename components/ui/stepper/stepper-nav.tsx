import * as React from "react";

import { cn } from "@szum-tech/design-system/utils";
import { useStepper } from "~/components/ui/stepper/stepper.context";

export type StepperNavProps = React.ComponentProps<"nav">;

export function StepperNav({ children, className }: StepperNavProps) {
  const { activeStep, orientation } = useStepper();

  return (
    <nav
      data-slot="stepper-nav"
      data-state={activeStep}
      data-orientation={orientation}
      className={cn(
        "group/stepper-nav inline-flex gap-4",
        "data-[orientation=horizontal]:w-full data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col",
        className
      )}
    >
      {children}
    </nav>
  );
}
