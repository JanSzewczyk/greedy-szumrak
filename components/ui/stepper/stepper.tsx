import * as React from "react";

import { cn } from "@szum-tech/design-system/utils";
import { type StepperItemProps } from "~/components/ui/stepper/stepper-item";
import { type StepperNavProps } from "~/components/ui/stepper/stepper-nav";
import { StepperContext, type StepperContextValue } from "~/components/ui/stepper/stepper.context";
import { useValidationLog } from "~/components/ui/stepper/use-validation-log";

import { type StepIndicators, type StepperOrientation } from "./stepper.types";

interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: number;
  value?: number;
  onValueChange?: (value: number) => void;
  orientation?: StepperOrientation;
  indicators?: StepIndicators;
}

export function Stepper({
  defaultValue = 1,
  value,
  onValueChange,
  orientation = "horizontal",
  className,
  children,
  indicators = {},
  ...props
}: StepperProps) {
  const [isMounted, setIsMounted] = React.useState<boolean>(false);
  const [steps, setSteps] = React.useState<Array<string | number>>([]);

  const [activeStep, setActiveStep] = React.useState(defaultValue);
  const currentStep = value ?? activeStep;

  useValidationLog({
    scope: "Stepper",
    check: !isMounted || (isMounted && steps.includes(currentStep)),
    message: `Invalid step value. Step "${currentStep}" does not exist in the list of available steps: [${steps.join(", ")}]`
  });

  const stepperNavItems = React.useMemo(() => {
    return (
      React.Children.toArray(children).find(
        (child): child is React.ReactElement =>
          React.isValidElement(child) && (child.type as { name?: string }).name === "StepperNav"
      )?.props as StepperNavProps
    ).children;
  }, [children]);

  React.useEffect(() => {
    const items =
      (React.Children.toArray(stepperNavItems).filter(
        (child): child is React.ReactElement =>
          React.isValidElement(child) && (child.type as { name?: string }).name === "StepperItem"
      ) as Array<React.ReactElement<StepperItemProps>>) ?? [];

    const itemsSteps = items.map((item) => item.props.step);

    if (steps.length !== itemsSteps.length || !steps.every((step, i) => step === itemsSteps[i])) {
      setSteps(itemsSteps);
    }

    setIsMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepperNavItems]);

  /**
   * Track all the trigger nodes in the stepper.
   */
  const [triggerNodes, setTriggerNodes] = React.useState<HTMLButtonElement[]>([]);

  // Register/unregister triggers
  const registerTrigger = React.useCallback((node: HTMLButtonElement | null) => {
    setTriggerNodes((prev) => {
      if (node && !prev.includes(node)) {
        return [...prev, node];
      } else if (!node && prev.includes(node!)) {
        return prev.filter((n) => n !== node);
      } else {
        return prev;
      }
    });
  }, []);

  const handleSetActiveStep = React.useCallback(
    function (step: number) {
      if (value === undefined) {
        setActiveStep(step);
      }
      onValueChange?.(step);
    },
    [value, onValueChange]
  );

  // Keyboard navigation logic
  function focusTrigger(index: number) {
    if (triggerNodes[index]) {
      triggerNodes[index].focus();
    }
  }

  function focusNext(currentIdx: number) {
    focusTrigger((currentIdx + 1) % triggerNodes.length);
  }
  function focusPrev(currentIdx: number) {
    focusTrigger((currentIdx - 1 + triggerNodes.length) % triggerNodes.length);
  }
  function focusFirst() {
    focusTrigger(0);
  }
  function focusLast() {
    focusTrigger(steps.length - 1);
  }

  // Context value
  const contextValue = React.useMemo<StepperContextValue>(
    () => ({
      activeStep: currentStep,
      setActiveStep: handleSetActiveStep,
      orientation,
      registerTrigger,
      focusNext,
      focusPrev,
      focusFirst,
      focusLast,
      triggerNodes,
      indicators,
      isMounted,
      stepsCount: steps.length,
      steps
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentStep, handleSetActiveStep, steps, children, orientation, registerTrigger, triggerNodes, isMounted]
  );

  return (
    <StepperContext.Provider value={contextValue}>
      <div
        role="tablist"
        aria-orientation={orientation}
        data-slot="stepper"
        className={cn("w-full", className)}
        data-orientation={orientation}
        {...props}
      >
        {children}
      </div>
    </StepperContext.Provider>
  );
}
