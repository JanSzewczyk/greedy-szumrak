import * as React from "react";

import { cn } from "@szum-tech/design-system/utils";

export function StepperDescription({ children, className }: React.ComponentProps<"div">) {
  return (
    <div data-slot="stepper-description" className={cn("text-sm text-gray-700", className)}>
      {children}
    </div>
  );
}
