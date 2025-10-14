import * as React from "react";

import { Slot } from "@radix-ui/react-slot";
import { cn } from "@szum-tech/design-system/utils";
import { STEPPER_CONTENT_NAME } from "~/components/ui/v2/stepper.constants";
import { useStepperContext } from "~/components/ui/v2/stepper.context";
import { useStepperStore } from "~/components/ui/v2/stepper.store";
import { getId } from "~/components/ui/v2/stepper.utils";

export type StepperContentProps = React.ComponentProps<"div"> & {
  asChild?: boolean;
  value: string;
  forceMount?: boolean;
};

export function StepperContent({
  value: valueProp,
  asChild = false,
  forceMount = false,
  className,
  ...props
}: StepperContentProps) {
  const context = useStepperContext(STEPPER_CONTENT_NAME);
  const value = useStepperStore((state) => state.value);

  const contentId = getId(context.id, "content", valueProp);
  const triggerId = getId(context.id, "trigger", valueProp);

  const isActive = value === valueProp;

  if (!isActive && !forceMount) {
    return null;
  }

  const ContentPrimitive = asChild ? Slot : "div";

  return (
    <ContentPrimitive
      id={contentId}
      role="tabpanel"
      data-state={value}
      aria-labelledby={triggerId}
      data-slot="stepper-content"
      dir={context.dir}
      className={cn("w-full", className, !isActive && forceMount && "hidden")}
      hidden={!isActive && forceMount}
      {...props}
    />
  );
}
