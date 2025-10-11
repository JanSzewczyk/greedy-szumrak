import * as React from "react";

import { cn } from "@szum-tech/design-system/utils";
import { useStepItem, useStepper } from "~/components/ui/stepper/stepper.context";

export type StepperIndicatorProps = React.ComponentProps<"div">;

export function StepperIndicator({ children, className }: StepperIndicatorProps) {
  const { state, isLoading } = useStepItem();
  const { indicators } = useStepper();
  return (
    <div
      data-slot="stepper-indicator"
      data-state={state}
      className={cn(
        "bg-app-foreground end relative flex size-6 shrink-0 items-center justify-center self-end overflow-hidden rounded-t border-x border-t border-gray-800 text-xs transition-colors duration-300",
        "data-[state=completed]:bg-success-500/50 data-[state=completed]:border-success-500",
        "data-[state=active]:bg-primary-500/50 data-[state=active]:border-primary-500",
        className
      )}
    >
      <div className="absolute">
        {indicators &&
        ((isLoading && indicators.loading) ||
          (state === "completed" && indicators.completed) ||
          (state === "active" && indicators.active) ||
          (state === "inactive" && indicators.inactive))
          ? (isLoading && indicators.loading) ||
            (state === "completed" && indicators.completed) ||
            (state === "active" && indicators.active) ||
            (state === "inactive" && indicators.inactive)
          : children}
      </div>
    </div>
  );
}
