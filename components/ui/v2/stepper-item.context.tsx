import * as React from "react";

import { STEPPER_ITEM_NAME } from "~/components/ui/v2/stepper.constants";
import { type StepperStepState } from "~/components/ui/v2/stepper.store";

export type StepperItemContextValue = {
  value: string;
  stepState: StepperStepState | undefined;
};

export const StepperItemContext = React.createContext<StepperItemContextValue | null>(null);

export function useStepperItemContext(consumerName: string) {
  const context = React.useContext(StepperItemContext);

  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within \`${STEPPER_ITEM_NAME}\``);
  }

  return context;
}
