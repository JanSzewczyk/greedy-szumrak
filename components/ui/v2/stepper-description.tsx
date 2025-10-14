import * as React from "react";

import { Slot } from "@radix-ui/react-slot";
import { cn } from "@szum-tech/design-system/utils";
import { useStepperItemContext } from "~/components/ui/v2/stepper-item.context";
import { STEPPER_DESCRIPTION_NAME } from "~/components/ui/v2/stepper.constants";
import { useStepperContext } from "~/components/ui/v2/stepper.context";
import { getId } from "~/components/ui/v2/stepper.utils";

export type StepperDescriptionProps = React.ComponentProps<"span"> & {
  asChild?: boolean;
};

export function StepperDescription({ className, asChild, ...props }: StepperDescriptionProps) {
  const context = useStepperContext(STEPPER_DESCRIPTION_NAME);
  const itemContext = useStepperItemContext(STEPPER_DESCRIPTION_NAME);

  const descriptionId = getId(context.id, "description", itemContext.value);

  const StepperDescriptionPrimitive = asChild ? Slot : "span";

  return (
    <StepperDescriptionPrimitive
      id={descriptionId}
      data-slot="stepper-description"
      dir={context.dir}
      className={cn("text-sm text-gray-700", className)}
      {...props}
    />
  );
}
