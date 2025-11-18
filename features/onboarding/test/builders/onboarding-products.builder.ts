import { build } from "@jackfranklin/test-data-bot";
import { type OnboardingProducts } from "~/features/onboarding/types/onboarding";

/**
 * Builder for generating OnboardingProducts test data.
 *
 * @example
 * // Basic usage (using .one())
 * const products = onboardingProductsBuilder.one();
 *
 * @example
 * // Alternative usage (direct call)
 * const products = onboardingProductsBuilder();
 *
 * @example
 * // Override specific fields
 * const budgetOnly = onboardingProductsBuilder.one({
 *   overrides: {
 *     budget: true,
 *     investment: false
 *   }
 * });
 *
 * @example
 * // Using traits
 * const allProducts = onboardingProductsBuilder.one({ traits: ["all"] });
 * const budgetOnly = onboardingProductsBuilder.one({ traits: ["budgetOnly"] });
 * const investmentOnly = onboardingProductsBuilder.one({ traits: ["investmentOnly"] });
 */
export const onboardingProductsBuilder = build<OnboardingProducts>({
  fields: {
    budget: true,
    investment: true
  },
  traits: {
    all: {
      overrides: {
        budget: true,
        investment: true
      }
    },
    budgetOnly: {
      overrides: {
        budget: true,
        investment: false
      }
    },
    investmentOnly: {
      overrides: {
        budget: false,
        investment: true
      }
    },
    none: {
      overrides: {
        budget: false,
        investment: false
      }
    }
  }
});
