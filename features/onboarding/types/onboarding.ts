import { type BudgetDetailsFormData } from "~/features/onboarding/schemas/budget-details";
import { type BudgetSetupFormData } from "~/features/onboarding/schemas/budget-setup";
import { type InvestmentAccountFormData } from "~/features/onboarding/schemas/investments";
import { type PreferencesFormData } from "~/features/onboarding/schemas/preferences";
import { type ProductsFormData } from "~/features/onboarding/schemas/product";
import { type CreateDto, type UpdateDto, type WithDates, type WithFirestoreTimestamps } from "~/lib/firebase/types";

export const OnboardingSteps = {
  WELCOME: "/onboarding/welcome",
  PREFERENCES: "/onboarding/preferences",
  BUDGET_SETUP: "/onboarding/budget-setup",
  BUDGET_DETAILS: "/onboarding/budget-details",
  CATEGORIES: "/onboarding/categories",
  INVESTMENTS: "/onboarding/investments",
  COMPLETE: "/onboarding/complete"
} as const;
export type OnboardingStep = (typeof OnboardingSteps)[keyof typeof OnboardingSteps];

export type OnboardingProducts = ProductsFormData;
export type OnboardingPreferences = PreferencesFormData;
export type OnboardingBudget = BudgetSetupFormData;
export type OnboardingBudgetDetails = BudgetDetailsFormData;
export type OnboardingInvestment = InvestmentAccountFormData;
export type OnboardingInvestments = Array<OnboardingInvestment>;

/**
 * Base type representing onboarding fields without timestamps
 */
export type OnboardingBase = {
  completed: boolean;
  completedAt: Date | null;
  currentStep: OnboardingStep;
  products: OnboardingProducts;
  preferences: OnboardingPreferences | null;
  budget: OnboardingBudget | null;
  budgetDetails: OnboardingBudgetDetails | null;
  investments: Array<OnboardingInvestment>;
};

/**
 * Onboarding data as stored in Firestore (with Timestamp objects)
 * Used when reading raw data from Firestore before transformation
 */
export type OnboardingFirestore = WithFirestoreTimestamps<OnboardingBase>;

/**
 * Onboarding data with Date objects (application layer)
 * Used after transforming Firestore data for application use
 */
export type Onboarding = WithDates<OnboardingBase>;

/**
 * Data structure for creating new onboarding records
 * Uses FieldValue.serverTimestamp() for automatic timestamp generation
 */
export type CreateOnboardingDto = CreateDto<OnboardingBase>;

/**
 * Data structure for updating existing onboarding records
 * Note: updatedAt is automatically added by the update function with serverTimestamp()
 */
export type UpdateOnboardingDto = UpdateDto<OnboardingBase>;
