import { type PreferencesFormData, type ProductsFormData } from "~/features/onboarding/schema";
import { type CreateDto, type UpdateDto, type WithDates, type WithFirestoreTimestamps } from "~/lib/firebase/types";

export const OnboardingSteps = {
  WELCOME: "/onboarding/welcome",
  PREFERENCES: "/onboarding/preferences",
  GOALS: "/onboarding/goals",
  CATEGORIES: "/onboarding/categories"
} as const;
export type OnboardingStep = (typeof OnboardingSteps)[keyof typeof OnboardingSteps];

export type OnboardingProducts = ProductsFormData;
export type OnboardingPreferences = PreferencesFormData;

/**
 * Base type representing onboarding fields without timestamps
 */
export type OnboardingBase = {
  completed: boolean;
  currentStep: OnboardingStep;
  products: OnboardingProducts;
  preferences?: OnboardingPreferences;
  goals?: {
    budget: number;
    savings: number;
    investmentTarget: number;
  };
  expenses?: {
    categories: Array<string>;
  };
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
