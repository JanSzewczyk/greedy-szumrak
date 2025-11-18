/**
 * Onboarding feature test data builders
 *
 * This module exports builders for generating mock data for onboarding-related types.
 * All builders use @jackfranklin/test-data-bot and @faker-js/faker/locale/pl.
 *
 * @example
 * // Import individual builders
 * import { onboardingBuilder, onboardingProductsBuilder } from "~/features/onboarding/test/builders";
 *
 * // Use in tests
 * const onboarding = onboardingBuilder.one();
 * const completed = onboardingBuilder.one({ traits: ["completed"] });
 *
 * @example
 * // Use helper functions
 * import { createTestOnboarding } from "~/features/onboarding/test/builders";
 *
 * const initial = createTestOnboarding.initial();
 * const forUser = createTestOnboarding.forUser("user-123");
 */

export { onboardingProductsBuilder } from "./onboarding-products.builder";
export { onboardingPreferencesBuilder } from "./onboarding-preferences.builder";
export { onboardingBudgetBuilder } from "./onboarding-budget.builder";
export { onboardingBuilder, onboardingBaseBuilder, createTestOnboarding } from "./onboarding.builder";
