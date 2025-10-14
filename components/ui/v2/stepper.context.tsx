import * as React from "react";

import { type StepperOrientation } from "~/components/ui/stepper/stepper.types";
import { STEPPER_ROOT_NAME } from "~/components/ui/v2/stepper.constants";
import { type StepperActivationMode } from "~/components/ui/v2/stepper.types";
import { type Direction } from "~/contexts/directon";

export interface StepperContextValue {
  id: string;
  dir: Direction;
  orientation: StepperOrientation;
  activationMode: StepperActivationMode;
  disabled: boolean;
  nonInteractive: boolean;
  loop: boolean;
}

export const StepperContext = React.createContext<StepperContextValue | null>(null);

export function useStepperContext(consumerName: string) {
  const context = React.useContext(StepperContext);

  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within \`${STEPPER_ROOT_NAME}\``);
  }

  return context;
}
