import * as React from "react";

import { cn } from "@szum-tech/design-system/utils";

export type StepperTitleProps = React.ComponentProps<"h3">;

export function StepperTitle({ children, className }: StepperTitleProps) {
  return (
    <h3 data-slot="stepper-title" className={cn("text-sm leading-none font-medium", className)}>
      {children}
    </h3>
  );
}
