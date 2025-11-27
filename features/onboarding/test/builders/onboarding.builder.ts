import { faker } from "@faker-js/faker/locale/pl";
import { build, perBuild } from "@jackfranklin/test-data-bot";
import { type Onboarding, type OnboardingBase, OnboardingSteps } from "~/features/onboarding/types/onboarding";

import { onboardingBudgetBuilder } from "./onboarding-budget.builder";
import { onboardingBudgetDetailsBuilder } from "./onboarding-budget-details.builder";
import { onboardingPreferencesBuilder } from "./onboarding-preferences.builder";
import { onboardingProductsBuilder } from "./onboarding-products.builder";

/**
 * Builder for generating OnboardingBase test data (without id and timestamps).
 *
 * @example
 * // Basic usage (using .one())
 * const onboardingBase = onboardingBaseBuilder.one();
 *
 * @example
 * // Alternative usage (direct call)
 * const onboardingBase = onboardingBaseBuilder();
 *
 * @example
 * // Override specific fields
 * const customOnboarding = onboardingBaseBuilder.one({
 *   overrides: {
 *     currentStep: OnboardingSteps.CATEGORIES
 *   }
 * });
 *
 * @example
 * // Using traits
 * const initial = onboardingBaseBuilder.one({ traits: ["initial"] });
 * const inProgress = onboardingBaseBuilder.one({ traits: ["inProgress"] });
 * const completed = onboardingBaseBuilder.one({ traits: ["completed"] });
 * const withAllData = onboardingBaseBuilder.one({ traits: ["withAllData"] });
 */
export const onboardingBaseBuilder = build<OnboardingBase>({
  fields: {
    completed: false,
    completedAt: null,
    currentStep: OnboardingSteps.PREFERENCES,
    products: perBuild(() => onboardingProductsBuilder.one())
  },
  traits: {
    initial: {
      overrides: {
        completed: false,
        completedAt: null,
        currentStep: OnboardingSteps.WELCOME,
        products: perBuild(() => onboardingProductsBuilder.one({ traits: ["all"] }))
      }
    },
    inProgress: {
      overrides: {
        completed: false,
        completedAt: null,
        currentStep: OnboardingSteps.BUDGET_SETUP,
        products: perBuild(() => onboardingProductsBuilder.one({ traits: ["all"] })),
        preferences: perBuild(() => onboardingPreferencesBuilder.one({ traits: ["pln"] })),
        budget: perBuild(() => onboardingBudgetBuilder.one({ traits: ["youngProfessional"] }))
      }
    },
    inProgressBudgetDetails: {
      overrides: {
        completed: false,
        completedAt: null,
        currentStep: OnboardingSteps.BUDGET_DETAILS,
        products: perBuild(() => onboardingProductsBuilder.one({ traits: ["all"] })),
        preferences: perBuild(() => onboardingPreferencesBuilder.one({ traits: ["pln"] })),
        budget: perBuild(() => onboardingBudgetBuilder.one({ traits: ["youngProfessional"] })),
        budgetDetails: perBuild(() => onboardingBudgetDetailsBuilder.one({ traits: ["youngProfessional"] }))
      }
    },
    completed: {
      overrides: {
        completed: true,
        completedAt: perBuild(() => faker.date.recent()),
        currentStep: OnboardingSteps.CATEGORIES,
        products: perBuild(() => onboardingProductsBuilder.one({ traits: ["all"] })),
        preferences: perBuild(() => onboardingPreferencesBuilder.one({ traits: ["pln"] })),
        budget: perBuild(() => onboardingBudgetBuilder.one({ traits: ["youngProfessional"] })),
        budgetDetails: perBuild(() => onboardingBudgetDetailsBuilder.one({ traits: ["youngProfessional"] })),
        goals: {
          budget: perBuild(() => faker.number.float({ min: 5000, max: 20000, fractionDigits: 2 })),
          savings: perBuild(() => faker.number.float({ min: 1000, max: 10000, fractionDigits: 2 })),
          investmentTarget: perBuild(() => faker.number.float({ min: 5000, max: 50000, fractionDigits: 2 }))
        },
        expenses: {
          categories: perBuild(() =>
            faker.helpers.arrayElements(
              ["groceries", "transport", "entertainment", "utilities", "healthcare", "education"],
              { min: 2, max: 5 }
            )
          )
        }
      }
    },
    withAllData: {
      overrides: {
        completed: false,
        completedAt: null,
        currentStep: OnboardingSteps.CATEGORIES,
        products: perBuild(() => onboardingProductsBuilder.one({ traits: ["all"] })),
        preferences: perBuild(() => onboardingPreferencesBuilder.one()),
        budget: perBuild(() => onboardingBudgetBuilder.one()),
        budgetDetails: perBuild(() => onboardingBudgetDetailsBuilder.one()),
        goals: {
          budget: perBuild(() => faker.number.float({ min: 5000, max: 20000, fractionDigits: 2 })),
          savings: perBuild(() => faker.number.float({ min: 1000, max: 10000, fractionDigits: 2 })),
          investmentTarget: perBuild(() => faker.number.float({ min: 5000, max: 50000, fractionDigits: 2 }))
        },
        expenses: {
          categories: perBuild(() =>
            faker.helpers.arrayElements(
              ["groceries", "transport", "entertainment", "utilities", "healthcare", "education"],
              { min: 3, max: 6 }
            )
          )
        }
      }
    }
  }
});

/**
 * Builder for generating Onboarding test data (with id and timestamps).
 *
 * @example
 * // Basic usage (using .one())
 * const onboarding = onboardingBuilder.one();
 *
 * @example
 * // Alternative usage (direct call)
 * const onboarding = onboardingBuilder();
 *
 * @example
 * // Override specific fields
 * const customOnboarding = onboardingBuilder.one({
 *   overrides: {
 *     id: "user-123",
 *     currentStep: OnboardingSteps.CATEGORIES
 *   }
 * });
 *
 * @example
 * // Generate multiple items
 * const onboardings = Array.from({ length: 5 }, () => onboardingBuilder.one());
 *
 * @example
 * // Using traits
 * const initial = onboardingBuilder.one({ traits: ["initial"] });
 * const inProgress = onboardingBuilder.one({ traits: ["inProgress"] });
 * const completed = onboardingBuilder.one({ traits: ["completed"] });
 * const withAllData = onboardingBuilder.one({ traits: ["withAllData"] });
 *
 * @example
 * // Combining traits and overrides
 * const customCompleted = onboardingBuilder.one({
 *   traits: ["completed"],
 *   overrides: {
 *     id: "specific-user-id",
 *     preferences: preferencesBuilder.one({ traits: ["usd"] })
 *   }
 * });
 */
export const onboardingBuilder = build<Onboarding>({
  fields: {
    id: perBuild(() => faker.string.uuid()),
    completed: false,
    completedAt: null,
    currentStep: OnboardingSteps.PREFERENCES,
    products: perBuild(() => onboardingProductsBuilder.one()),
    createdAt: perBuild(() => faker.date.past()),
    updatedAt: perBuild(() => faker.date.recent())
  },
  traits: {
    initial: {
      overrides: {
        completed: false,
        completedAt: null,
        currentStep: OnboardingSteps.WELCOME,
        products: perBuild(() => onboardingProductsBuilder.one({ traits: ["all"] }))
      }
    },
    inProgress: {
      overrides: {
        completed: false,
        completedAt: null,
        currentStep: OnboardingSteps.BUDGET_SETUP,
        products: perBuild(() => onboardingProductsBuilder.one({ traits: ["all"] })),
        preferences: perBuild(() => onboardingPreferencesBuilder.one({ traits: ["pln"] })),
        budget: perBuild(() => onboardingBudgetBuilder.one({ traits: ["youngProfessional"] }))
      }
    },
    inProgressBudgetDetails: {
      overrides: {
        completed: false,
        completedAt: null,
        currentStep: OnboardingSteps.BUDGET_DETAILS,
        products: perBuild(() => onboardingProductsBuilder.one({ traits: ["all"] })),
        preferences: perBuild(() => onboardingPreferencesBuilder.one({ traits: ["pln"] })),
        budget: perBuild(() => onboardingBudgetBuilder.one({ traits: ["youngProfessional"] })),
        budgetDetails: perBuild(() => onboardingBudgetDetailsBuilder.one({ traits: ["youngProfessional"] }))
      }
    },
    completed: {
      overrides: {
        completed: true,
        completedAt: perBuild(() => faker.date.recent()),
        currentStep: OnboardingSteps.CATEGORIES,
        products: perBuild(() => onboardingProductsBuilder.one({ traits: ["all"] })),
        preferences: perBuild(() => onboardingPreferencesBuilder.one({ traits: ["pln"] })),
        budget: perBuild(() => onboardingBudgetBuilder.one({ traits: ["youngProfessional"] })),
        budgetDetails: perBuild(() => onboardingBudgetDetailsBuilder.one({ traits: ["youngProfessional"] })),
        goals: {
          budget: perBuild(() => faker.number.float({ min: 5000, max: 20000, fractionDigits: 2 })),
          savings: perBuild(() => faker.number.float({ min: 1000, max: 10000, fractionDigits: 2 })),
          investmentTarget: perBuild(() => faker.number.float({ min: 5000, max: 50000, fractionDigits: 2 }))
        },
        expenses: {
          categories: perBuild(() =>
            faker.helpers.arrayElements(
              ["groceries", "transport", "entertainment", "utilities", "healthcare", "education"],
              { min: 2, max: 5 }
            )
          )
        }
      }
    },
    withAllData: {
      overrides: {
        completed: false,
        completedAt: null,
        currentStep: OnboardingSteps.CATEGORIES,
        products: perBuild(() => onboardingProductsBuilder.one({ traits: ["all"] })),
        preferences: perBuild(() => onboardingPreferencesBuilder.one()),
        budget: perBuild(() => onboardingBudgetBuilder.one()),
        budgetDetails: perBuild(() => onboardingBudgetDetailsBuilder.one()),
        goals: {
          budget: perBuild(() => faker.number.float({ min: 5000, max: 20000, fractionDigits: 2 })),
          savings: perBuild(() => faker.number.float({ min: 1000, max: 10000, fractionDigits: 2 })),
          investmentTarget: perBuild(() => faker.number.float({ min: 5000, max: 50000, fractionDigits: 2 }))
        },
        expenses: {
          categories: perBuild(() =>
            faker.helpers.arrayElements(
              ["groceries", "transport", "entertainment", "utilities", "healthcare", "education"],
              { min: 3, max: 6 }
            )
          )
        }
      }
    }
  }
});

/**
 * Helper functions for common onboarding test scenarios.
 */
export const createTestOnboarding = {
  /**
   * Create an initial onboarding at the welcome step
   */
  initial: () => onboardingBuilder.one({ traits: ["initial"] }),

  /**
   * Create an in-progress onboarding with partial data (at budget setup step)
   */
  inProgress: () => onboardingBuilder.one({ traits: ["inProgress"] }),

  /**
   * Create an in-progress onboarding at budget details step
   */
  inProgressBudgetDetails: () => onboardingBuilder.one({ traits: ["inProgressBudgetDetails"] }),

  /**
   * Create a completed onboarding with all data filled
   */
  completed: () => onboardingBuilder.one({ traits: ["completed"] }),

  /**
   * Create an onboarding with all optional fields populated but not yet completed
   */
  withAllData: () => onboardingBuilder.one({ traits: ["withAllData"] }),

  /**
   * Create multiple onboarding records
   */
  list: (count: number) => Array.from({ length: count }, () => onboardingBuilder.one()),

  /**
   * Create an onboarding for a specific user ID
   */
  forUser: (userId: string) => onboardingBuilder.one({ overrides: { id: userId } }),

  /**
   * Create an onboarding at a specific step
   */
  atStep: (step: string) =>
    onboardingBuilder.one({
      overrides: { currentStep: step as (typeof OnboardingSteps)[keyof typeof OnboardingSteps] }
    })
};
