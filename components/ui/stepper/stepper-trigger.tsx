import React from "react";

import { cn } from "@szum-tech/design-system/utils";
import { useStepItem, useStepper } from "~/components/ui/stepper/stepper.context";

export type StepperTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
};

export function StepperTrigger({ asChild = false, className, children, tabIndex, ...props }: StepperTriggerProps) {
  const { state, isLoading, step, isDisabled } = useStepItem();
  const { setActiveStep, activeStep, registerTrigger, triggerNodes, focusNext, focusPrev, focusFirst, focusLast } =
    useStepper();

  const isSelected = activeStep === step;
  const id = `stepper-tab-${step}`;
  const panelId = `stepper-panel-${step}`;

  // Register this trigger for keyboard navigation
  const btnRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (btnRef.current) {
      registerTrigger(btnRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [btnRef.current]);

  // Find our index among triggers for navigation
  const myIdx = React.useMemo(
    () => triggerNodes.findIndex((n: HTMLButtonElement) => n === btnRef.current),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [triggerNodes, btnRef.current]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        if (myIdx !== -1 && focusNext) focusNext(myIdx);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        if (myIdx !== -1 && focusPrev) focusPrev(myIdx);
        break;
      case "Home":
        e.preventDefault();
        if (focusFirst) focusFirst();
        break;
      case "End":
        e.preventDefault();
        if (focusLast) focusLast();
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        setActiveStep(step);
        break;
    }
  };

  if (asChild) {
    return (
      <span
        data-slot="stepper-trigger"
        data-state={state}
        className={cn("inline-flex w-full items-center gap-3", className)}
      >
        {children}
      </span>
    );
  }

  return (
    <button
      ref={btnRef}
      role="tab"
      id={id}
      aria-selected={isSelected}
      aria-controls={panelId}
      tabIndex={typeof tabIndex === "number" ? tabIndex : isSelected ? 0 : -1}
      data-slot="stepper-trigger"
      data-state={state}
      data-loading={isLoading}
      className={cn(
        "inline-flex w-full cursor-pointer items-center gap-3 rounded text-left transition-colors duration-300 outline-none",
        "text-gray-500 data-[state=active]:text-gray-100 data-[state=completed]:text-gray-100 data-[state=loading]:text-gray-100",
        "disabled:pointer-events-none disabled:opacity-60",
        "focus-visible:ring-primary-500/50 focus-visible:z-10 focus-visible:ring-[3px]",
        className
      )}
      onClick={() => setActiveStep(step)}
      onKeyDown={handleKeyDown}
      disabled={isDisabled}
      {...props}
    >
      {children}
    </button>
  );
}
