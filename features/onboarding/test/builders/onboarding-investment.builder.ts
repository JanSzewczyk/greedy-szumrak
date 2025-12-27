import { faker } from "@faker-js/faker/locale/pl";
import { build, oneOf, perBuild } from "@jackfranklin/test-data-bot";
import { BrokerId } from "~/features/onboarding/constants/investments";
import { type OnboardingInvestment } from "~/features/onboarding/types/onboarding";

/**
 * Builder for generating OnboardingInvestment test data.
 *
 * @example
 * // Basic usage (using .one())
 * const account = onboardingInvestmentBuilder.one();
 *
 * @example
 * // Alternative usage (direct call)
 * const account = onboardingInvestmentBuilder();
 *
 * @example
 * // Override specific fields
 * const customAccount = onboardingInvestmentBuilder.one({
 *   overrides: {
 *     brokerId: BrokerId.XTB,
 *     currency: "USD"
 *   }
 * });
 *
 * @example
 * // Using traits
 * const xtbAccount = onboardingInvestmentBuilder.one({ traits: ["xtb"] });
 * const revolutAccount = onboardingInvestmentBuilder.one({ traits: ["revolut"] });
 * const otherBroker = onboardingInvestmentBuilder.one({ traits: ["other"] });
 * const withCustomName = onboardingInvestmentBuilder.one({ traits: ["withCustomName"] });
 * const usdAccount = onboardingInvestmentBuilder.one({ traits: ["usd"] });
 */
export const onboardingInvestmentBuilder = build<OnboardingInvestment>({
  fields: {
    brokerId: oneOf(BrokerId.XTB, BrokerId.MBANK, BrokerId.REVOLUT, BrokerId.INTERACTIVE_BROKERS, BrokerId.DEGIRO),
    name: null,
    number: perBuild(() => faker.finance.accountNumber(10)),
    currency: "PLN"
  },
  traits: {
    xtb: {
      overrides: {
        brokerId: BrokerId.XTB,
        name: null
      }
    },
    mbank: {
      overrides: {
        brokerId: BrokerId.MBANK,
        name: null
      }
    },
    revolut: {
      overrides: {
        brokerId: BrokerId.REVOLUT,
        name: null
      }
    },
    interactiveBrokers: {
      overrides: {
        brokerId: BrokerId.INTERACTIVE_BROKERS,
        name: null
      }
    },
    degiro: {
      overrides: {
        brokerId: BrokerId.DEGIRO,
        name: null
      }
    },
    etoro: {
      overrides: {
        brokerId: BrokerId.ETORO,
        name: null
      }
    },
    other: {
      overrides: {
        brokerId: BrokerId.OTHER,
        name: perBuild(() => faker.company.name())
      }
    },
    withCustomName: {
      overrides: {
        name: perBuild(() => faker.finance.accountName())
      }
    },
    usd: {
      overrides: {
        currency: "USD"
      }
    },
    eur: {
      overrides: {
        currency: "EUR"
      }
    },
    pln: {
      overrides: {
        currency: "PLN"
      }
    }
  }
});

/**
 * Helper functions for common OnboardingInvestment test scenarios.
 */
export const createTestOnboardingInvestment = {
  /**
   * Create an XTB account with PLN currency
   */
  xtb: () => onboardingInvestmentBuilder.one({ traits: ["xtb", "pln"] }),

  /**
   * Create an mBank account with PLN currency
   */
  mbank: () => onboardingInvestmentBuilder.one({ traits: ["mbank", "pln"] }),

  /**
   * Create a Revolut account with EUR currency
   */
  revolut: () => onboardingInvestmentBuilder.one({ traits: ["revolut", "eur"] }),

  /**
   * Create an Interactive Brokers account with USD currency
   */
  interactiveBrokers: () => onboardingInvestmentBuilder.one({ traits: ["interactiveBrokers", "usd"] }),

  /**
   * Create a custom "Other" broker account
   */
  other: () => onboardingInvestmentBuilder.one({ traits: ["other", "pln"] }),

  /**
   * Create an account with a custom name
   */
  withCustomName: (brokerId: BrokerId = BrokerId.XTB) =>
    onboardingInvestmentBuilder.one({
      traits: ["withCustomName"],
      overrides: { brokerId }
    }),

  /**
   * Create multiple investment accounts
   */
  list: (count: number) => Array.from({ length: count }, () => onboardingInvestmentBuilder.one()),

  /**
   * Create a diverse list of accounts from different brokers
   */
  diverseList: () => [
    onboardingInvestmentBuilder.one({ traits: ["xtb", "pln"] }),
    onboardingInvestmentBuilder.one({ traits: ["revolut", "eur"] }),
    onboardingInvestmentBuilder.one({ traits: ["interactiveBrokers", "usd"] })
  ],

  /**
   * Create an account with a specific account number (useful for testing masked display)
   */
  withAccountNumber: (number: string) =>
    onboardingInvestmentBuilder.one({
      overrides: { number }
    })
};
