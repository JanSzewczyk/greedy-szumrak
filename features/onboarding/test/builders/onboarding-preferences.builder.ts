import { faker } from "@faker-js/faker/locale/pl";
import { build, perBuild } from "@jackfranklin/test-data-bot";
import { type OnboardingPreferences } from "~/features/onboarding/types/onboarding";

/**
 * Builder for generating OnboardingPreferences test data.
 *
 * @example
 * // Basic usage (using .one())
 * const preferences = onboardingPreferencesBuilder.one();
 *
 * @example
 * // Alternative usage (direct call)
 * const preferences = onboardingPreferencesBuilder();
 *
 * @example
 * // Override specific fields
 * const usdPreferences = onboardingPreferencesBuilder.one({
 *   overrides: {
 *     currency: "USD"
 *   }
 * });
 *
 * @example
 * // Using traits
 * const plnPreferences = onboardingPreferencesBuilder.one({ traits: ["pln"] });
 * const eurPreferences = onboardingPreferencesBuilder.one({ traits: ["eur"] });
 * const usdPreferences = onboardingPreferencesBuilder.one({ traits: ["usd"] });
 */
export const onboardingPreferencesBuilder = build<OnboardingPreferences>({
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
