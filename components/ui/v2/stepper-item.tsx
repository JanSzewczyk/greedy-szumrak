import * as React from "react";

import { Slot } from "@radix-ui/react-slot";
import { cn } from "@szum-tech/design-system/utils";
import { StepperItemContext, type StepperItemContextValue } from "~/components/ui/v2/stepper-item.context";
import { STEPPER_ITEM_NAME } from "~/components/ui/v2/stepper.constants";
import { useStepperContext } from "~/components/ui/v2/stepper.context";
import { useStepperStore, useStepperStoreContext } from "~/components/ui/v2/stepper.store";
import { getDataState, useIsomorphicLayoutEffect } from "~/components/ui/v2/stepper.utils";

export type StepperItemProps = React.ComponentProps<"div"> & {
  asChild?: boolean;
  value: string;
  completed?: boolean;
  disabled?: boolean;
};

export function StepperItem(props: StepperItemProps) {
  const { value: itemValue, completed = false, disabled = false, asChild, className, children, ...itemProps } = props;

  const context = useStepperContext(STEPPER_ITEM_NAME);
  const store = useStepperStoreContext(STEPPER_ITEM_NAME);
  const orientation = context.orientation;
  const value = useStepperStore((state) => state.value);

  useIsomorphicLayoutEffect(() => {
    store.addStep(itemValue, completed, disabled);

    return () => {
      store.removeStep(itemValue);
    };
  }, [itemValue, completed, disabled]);

  useIsomorphicLayoutEffect(() => {
    store.setStep(itemValue, completed, disabled);
  }, [itemValue, completed, disabled]);

  const stepState = useStepperStore((state) => state.steps.get(itemValue));
  const steps = useStepperStore((state) => state.steps);
  const dataState = getDataState(value, itemValue, stepState, steps);

  const itemContextValue = React.useMemo<StepperItemContextValue>(
    () => ({
      value: itemValue,
      stepState
    }),
    [itemValue, stepState]
  );

  const StepperItemPrimitive = asChild ? Slot : "div";

  return (
    <StepperItemContext.Provider value={itemContextValue}>
      <StepperItemPrimitive
        data-disabled={stepState?.disabled ? "" : undefined}
        data-orientation={orientation}
        data-state={dataState}
        data-slot="stepper-item"
        dir={context.dir}
        className={cn(
          "group/step flex flex-1 flex-col justify-end",
          "",
          // "group-data-[orientation=horizontal]/stepper-nav:flex-row group-data-[orientation=vertical]/stepper-nav:flex-col",
          className
        )}
        {...itemProps}
      >
        {children}
        <div
          data-state={dataState}
          className={cn(
            "h-1 w-full bg-gray-800 transition-colors duration-500",
            "data-[state=active]:bg-primary-500 data-[state=completed]:bg-success-500"
          )}
        />
      </StepperItemPrimitive>
    </StepperItemContext.Provider>
  );
}
