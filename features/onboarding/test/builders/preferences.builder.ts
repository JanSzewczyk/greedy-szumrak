import { build, perBuild } from "@jackfranklin/test-data-bot";
import { faker } from "@faker-js/faker/locale/pl";
import type { PreferencesFormData } from "~/features/onboarding/schema";

/**
 * Builder for generating PreferencesFormData test data.
 *
 * @example
 * // Basic usage (using .one())
 * const preferences = preferencesBuilder.one();
 *
 * @example
 * // Alternative usage (direct call)
 * const preferences = preferencesBuilder();
 *
 * @example
 * // Override specific fields
 * const usdPreferences = preferencesBuilder.one({
 *   overrides: {
 *     currency: "USD"
 *   }
 * });
 *
 * @example
 * // Using traits
 * const plnPreferences = preferencesBuilder.one({ traits: ["pln"] });
 * const eurPreferences = preferencesBuilder.one({ traits: ["eur"] });
 * const usdPreferences = preferencesBuilder.one({ traits: ["usd"] });
 */
export const preferencesBuilder = build<PreferencesFormData>({
  fields: {
    currency: perBuild(() => faker.helpers.arrayElement(["PLN", "USD", "EUR", "GBP"])),
    dateFormat: perBuild(() => faker.helpers.arrayElement(["dd/MM/yyyy", "MM/dd/yyyy", "yyyy-MM-dd"]))
  },
  traits: {
    pln: {
      overrides: {
        currency: "PLN",
        dateFormat: "dd/MM/yyyy"
      }
    },
    eur: {
      overrides: {
        currency: "EUR",
        dateFormat: "dd/MM/yyyy"
      }
    },
    usd: {
      overrides: {
        currency: "USD",
        dateFormat: "MM/dd/yyyy"
      }
    },
    gbp: {
      overrides: {
        currency: "GBP",
        dateFormat: "dd/MM/yyyy"
      }
    }
  }
});
