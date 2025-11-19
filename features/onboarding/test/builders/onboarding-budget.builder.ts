import { faker } from "@faker-js/faker/locale/pl";
import { build, perBuild } from "@jackfranklin/test-data-bot";
import { type OnboardingBudget } from "~/features/onboarding/types/onboarding";

/**
 * Builder for generating OnboardingBudget test data.
 *
 * @example
 * // Basic usage (using .one())
 * const budget = onboardingBudgetBuilder.one();
 *
 * @example
 * // Alternative usage (direct call)
 * const budget = onboardingBudgetBuilder();
 *
 * @example
 * // Override specific fields
 * const highIncome = onboardingBudgetBuilder.one({
 *   overrides: {
 *     monthlyIncome: 15000
 *   }
 * });
 *
 * @example
 * // Using traits
 * const youngProfessional = onboardingBudgetBuilder.one({ traits: ["youngProfessional"] });
 * const family = onboardingBudgetBuilder.one({ traits: ["family"] });
 * const student = onboardingBudgetBuilder.one({ traits: ["student"] });
 * const aggressiveSaver = onboardingBudgetBuilder.one({ traits: ["aggressiveSaver"] });
 */
export const onboardingBudgetBuilder = build<OnboardingBudget>({
  fields: {
    monthlyIncome: perBuild(() => faker.number.int({ min: 3000, max: 20000, multipleOf: 100 })),
    budgetProfile: perBuild(() =>
      faker.helpers.arrayElement(["young_professional", "family", "aggressive_saver", "student"])
    )
  },
  traits: {
    youngProfessional: {
      overrides: {
        budgetProfile: "young_professional",
        monthlyIncome: perBuild(() => faker.number.int({ min: 5000, max: 10000, multipleOf: 100 }))
      }
    },
    family: {
      overrides: {
        budgetProfile: "family",
        monthlyIncome: perBuild(() => faker.number.int({ min: 8000, max: 15000, multipleOf: 100 }))
      }
    },
    aggressiveSaver: {
      overrides: {
        budgetProfile: "aggressive_saver",
        monthlyIncome: perBuild(() => faker.number.int({ min: 6000, max: 12000, multipleOf: 100 }))
      }
    },
    student: {
      overrides: {
        budgetProfile: "student",
        monthlyIncome: perBuild(() => faker.number.int({ min: 2000, max: 5000, multipleOf: 100 }))
      }
    },
    custom: {
      overrides: {
        budgetProfile: "custom"
      }
    }
  }
});
