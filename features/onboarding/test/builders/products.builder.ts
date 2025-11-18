import { build } from "@jackfranklin/test-data-bot";
import { type ProductsFormData } from "~/features/onboarding/shemas/product";

/**
 * Builder for generating ProductsFormData test data.
 *
 * @example
 * // Basic usage (using .one())
 * const products = productsBuilder.one();
 *
 * @example
 * // Alternative usage (direct call)
 * const products = productsBuilder();
 *
 * @example
 * // Override specific fields
 * const budgetOnly = productsBuilder.one({
 *   overrides: {
 *     budget: true,
 *     investment: false
 *   }
 * });
 *
 * @example
 * // Using traits
 * const allProducts = productsBuilder.one({ traits: ["all"] });
 * const budgetOnly = productsBuilder.one({ traits: ["budgetOnly"] });
 * const investmentOnly = productsBuilder.one({ traits: ["investmentOnly"] });
 */
export const productsBuilder = build<ProductsFormData>({
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
