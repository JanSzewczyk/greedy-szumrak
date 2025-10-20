export const OnboardingSteps = {
  WELCOME: "/onboarding/welcome",
  PREFERENCES: "/onboarding/preferences",
  GOALS: "/onboarding/goals",
  CATEGORIES: "/onboarding/categories"
} as const;
export type OnboardingStep = (typeof OnboardingSteps)[keyof typeof OnboardingSteps];

export type Onboarding = {
  id?: string;
  userId: string;
  completed: boolean;
  currentStep: OnboardingStep;
  preferences: {
    currency: string | null;
    language: string | null;
  };
  goals: {
    budget: number | null;
    savings: number | null;
    investmentTarget: number | null;
  };
  expenses: {
    categories: Array<string>;
  };
};
