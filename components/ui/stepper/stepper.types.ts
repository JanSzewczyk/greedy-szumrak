import type * as React from "react";

export const StepperOrientation = { HORIZONTAL: "horizontal", VERTICAL: "vertical" } as const;
export type StepperOrientation = (typeof StepperOrientation)[keyof typeof StepperOrientation];

export const StepState = { ACTIVE: "active", COMPLETE: "completed", INACTIVE: "inactive", LOADING: "loading" } as const;
export type StepState = (typeof StepState)[keyof typeof StepState];

export type StepIndicators = {
  active?: React.ReactNode;
  completed?: React.ReactNode;
  inactive?: React.ReactNode;
  loading?: React.ReactNode;
};

export type StepperStep = string | number;
