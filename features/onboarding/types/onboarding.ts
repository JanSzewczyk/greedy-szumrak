import { type FieldValue } from "firebase-admin/firestore";
import { type ProductsFormData } from "~/features/onboarding/schema";

export const OnboardingSteps = {
  WELCOME: "/onboarding/welcome",
  PREFERENCES: "/onboarding/preferences",
  GOALS: "/onboarding/goals",
  CATEGORIES: "/onboarding/categories"
} as const;
export type OnboardingStep = (typeof OnboardingSteps)[keyof typeof OnboardingSteps];

export type Onboarding = {
  id: string;
  completed: boolean;
  currentStep: OnboardingStep;
  products: OnboardingProducts;
  preferences?: {
    currency: string;
    dateFormat: string;
  };
  goals?: {
    budget: number;
    savings: number;
    investmentTarget: number;
  };
  expenses?: {
    categories: Array<string>;
  };
  updatedAt: Date;
  createdAt: Date;
};

export type OnboardingProducts = ProductsFormData;

export type CreateOnboardingDto = Omit<
  Onboarding,
  "id" | "preferences" | "goals" | "expenses" | "createdAt" | "updatedAt"
> & {
  updatedAt: FieldValue;
  createdAt: FieldValue;
};
export type UpdateOnboardingDto = Omit<Onboarding, "id" | "updatedAt"> & { updatedAt?: FieldValue };
