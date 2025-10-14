import * as React from "react";

import { Check } from "lucide-react";

import { Slot } from "@radix-ui/react-slot";
import { cn } from "@szum-tech/design-system/utils";
import { useStepperItemContext } from "~/components/ui/v2/stepper-item.context";
import { STEPPER_INDICATOR_NAME } from "~/components/ui/v2/stepper.constants";
import { useStepperContext } from "~/components/ui/v2/stepper.context";
import { useStepperStore } from "~/components/ui/v2/stepper.store";
import { type StepperDataState } from "~/components/ui/v2/stepper.types";
import { getDataState } from "~/components/ui/v2/stepper.utils";

export type StepperIndicatorProps = Omit<React.ComponentProps<"div">, "children"> & {
  asChild?: boolean;
  children?: React.ReactNode | ((dataState: StepperDataState) => React.ReactNode);
};

export function StepperIndicator({ className, children, asChild, ref, ...indicatorProps }: StepperIndicatorProps) {
  const context = useStepperContext(STEPPER_INDICATOR_NAME);
  const itemContext = useStepperItemContext(STEPPER_INDICATOR_NAME);
  const value = useStepperStore((state) => state.value);
  const itemValue = itemContext.value;
  const stepState = useStepperStore((state) => state.steps.get(itemValue));
  const steps = useStepperStore((state) => state.steps);

  const stepPosition = Array.from(steps.keys()).indexOf(itemValue) + 1;

  const dataState = getDataState(value, itemValue, stepState, steps);

  const StepperIndicatorPrimitive = asChild ? Slot : "div";

  return (
    <StepperIndicatorPrimitive
      data-slot="stepper-indicator"
      data-state={dataState}
      dir={context.dir}
      {...indicatorProps}
      ref={ref}
      className={cn(
        "bg-app-foreground relative flex size-6 shrink-0 items-center justify-center self-end overflow-hidden rounded-t border-x border-t border-gray-800 text-xs transition-colors duration-500",
        "data-[state=completed]:bg-success-500/50 data-[state=completed]:border-success-500",
        "data-[state=active]:bg-primary-500/50 data-[state=active]:border-primary-500",
        className
      )}
    >
      <div className="absolute">
        {/*{indicators &&*/}
        {/*((isLoading && indicators.loading) ||*/}
        {/*  (state === "completed" && indicators.completed) ||*/}
        {/*  (state === "active" && indicators.active) ||*/}
        {/*  (state === "inactive" && indicators.inactive))*/}
        {/*  ? (isLoading && indicators.loading) ||*/}
        {/*  (state === "completed" && indicators.completed) ||*/}
        {/*  (state === "active" && indicators.active) ||*/}
        {/*  (state === "inactive" && indicators.inactive)*/}
        {/*  : children}*/}

        {typeof children === "function" ? children(dataState) : children ? children : stepPosition}
      </div>
    </StepperIndicatorPrimitive>
  );
}
