import { faker } from "@faker-js/faker/locale/pl";
import { build, perBuild } from "@jackfranklin/test-data-bot";
import { type IconName } from "lucide-react/dynamic";
import {
  type BudgetAllocationFormData,
  type BudgetCategoryDetailsFormData
} from "~/features/onboarding/schemas/budget-details";
import { type OnboardingBudgetDetails } from "~/features/onboarding/types/onboarding";

/**
 * Available category icons for budget categories
 */
const CATEGORY_ICONS: IconName[] = [
  "home",
  "shopping-cart",
  "car",
  "utensils",
  "smartphone",
  "zap",
  "heart",
  "graduation-cap",
  "film",
  "music",
  "gift",
  "briefcase",
  "piggy-bank",
  "trending-up",
  "building"
];

/**
 * Available colors for budget categories
 */
const CATEGORY_COLORS = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899"
];

/**
 * Builder for generating BudgetCategoryDetailsFormData test data.
 *
 * @example
 * // Basic usage
 * const category = budgetCategoryDetailsBuilder.one();
 *
 * @example
 * // Override specific fields
 * const housingCategory = budgetCategoryDetailsBuilder.one({
 *   overrides: {
 *     name: "Housing",
 *     percentage: 30,
 *     amount: 3000
 *   }
 * });
 *
 * @example
 * // Using traits
 * const needsCategory = budgetCategoryDetailsBuilder.one({ traits: ["needs"] });
 * const wantsCategory = budgetCategoryDetailsBuilder.one({ traits: ["wants"] });
 * const savingsCategory = budgetCategoryDetailsBuilder.one({ traits: ["savings"] });
 */
export const budgetCategoryDetailsBuilder = build<BudgetCategoryDetailsFormData>({
  fields: {
    name: perBuild(() => faker.commerce.department()),
    description: perBuild(() => faker.commerce.productDescription()),
    icon: perBuild(() => faker.helpers.arrayElement(CATEGORY_ICONS)),
    color: perBuild(() => faker.helpers.arrayElement(CATEGORY_COLORS)),
    percentage: perBuild(() => faker.number.int({ min: 5, max: 20 })),
    amount: perBuild(() => faker.number.int({ min: 100, max: 2000, multipleOf: 50 })),
    order: perBuild(() => faker.number.int({ min: 0, max: 10 })),
    examples: perBuild(() =>
      faker.helpers.arrayElements(["rent", "groceries", "utilities", "transport", "insurance"], { min: 1, max: 3 })
    )
  },
  traits: {
    needs: {
      overrides: {
        name: perBuild(() =>
          faker.helpers.arrayElement(["Housing", "Groceries", "Utilities", "Transportation", "Healthcare"])
        ),
        icon: perBuild(() => faker.helpers.arrayElement<IconName>(["home", "shopping-cart", "zap", "car", "heart"])),
        percentage: perBuild(() => faker.number.int({ min: 10, max: 25 })),
        examples: perBuild(() =>
          faker.helpers.arrayElements(["rent", "mortgage", "groceries", "electricity", "gas", "water"], {
            min: 2,
            max: 4
          })
        )
      }
    },
    wants: {
      overrides: {
        name: perBuild(() =>
          faker.helpers.arrayElement(["Entertainment", "Dining Out", "Shopping", "Subscriptions", "Hobbies"])
        ),
        icon: perBuild(() => faker.helpers.arrayElement<IconName>(["film", "utensils", "gift", "music", "smartphone"])),
        percentage: perBuild(() => faker.number.int({ min: 5, max: 15 })),
        examples: perBuild(() =>
          faker.helpers.arrayElements(["movies", "restaurants", "clothes", "Netflix", "gym"], { min: 2, max: 4 })
        )
      }
    },
    savings: {
      overrides: {
        name: perBuild(() =>
          faker.helpers.arrayElement(["Emergency Fund", "Investments", "Retirement", "Savings Account"])
        ),
        icon: perBuild(() =>
          faker.helpers.arrayElement<IconName>(["piggy-bank", "trending-up", "building", "briefcase"])
        ),
        percentage: perBuild(() => faker.number.int({ min: 5, max: 20 })),
        examples: perBuild(() =>
          faker.helpers.arrayElements(["stocks", "bonds", "401k", "emergency fund", "savings"], { min: 2, max: 3 })
        )
      }
    }
  }
});

/**
 * Builder for generating BudgetAllocationFormData test data.
 *
 * @example
 * // Basic usage
 * const allocation = budgetAllocationBuilder.one();
 *
 * @example
 * // Using traits
 * const needsAllocation = budgetAllocationBuilder.one({ traits: ["needs"] });
 * const wantsAllocation = budgetAllocationBuilder.one({ traits: ["wants"] });
 * const savingsAllocation = budgetAllocationBuilder.one({ traits: ["savings"] });
 */
export const budgetAllocationBuilder = build<BudgetAllocationFormData>({
  fields: {
    type: perBuild(() => faker.helpers.arrayElement(["needs", "wants", "savings"] as const)),
    percentage: perBuild(() => faker.number.int({ min: 10, max: 60 })),
    amount: perBuild(() => faker.number.int({ min: 500, max: 5000, multipleOf: 100 })),
    label: perBuild(() => faker.helpers.arrayElement(["Needs", "Wants", "Savings"])),
    categories: perBuild(() => [
      budgetCategoryDetailsBuilder.one(),
      budgetCategoryDetailsBuilder.one(),
      budgetCategoryDetailsBuilder.one()
    ])
  },
  traits: {
    needs: {
      overrides: {
        type: "needs",
        percentage: 50,
        label: "Needs",
        categories: perBuild(() => [
          budgetCategoryDetailsBuilder.one({
            traits: ["needs"],
            overrides: { name: "Housing", percentage: 25, order: 0 }
          }),
          budgetCategoryDetailsBuilder.one({
            traits: ["needs"],
            overrides: { name: "Groceries", percentage: 10, order: 1 }
          }),
          budgetCategoryDetailsBuilder.one({
            traits: ["needs"],
            overrides: { name: "Utilities", percentage: 8, order: 2 }
          }),
          budgetCategoryDetailsBuilder.one({
            traits: ["needs"],
            overrides: { name: "Transportation", percentage: 7, order: 3 }
          })
        ])
      }
    },
    wants: {
      overrides: {
        type: "wants",
        percentage: 30,
        label: "Wants",
        categories: perBuild(() => [
          budgetCategoryDetailsBuilder.one({
            traits: ["wants"],
            overrides: { name: "Entertainment", percentage: 10, order: 0 }
          }),
          budgetCategoryDetailsBuilder.one({
            traits: ["wants"],
            overrides: { name: "Dining Out", percentage: 8, order: 1 }
          }),
          budgetCategoryDetailsBuilder.one({
            traits: ["wants"],
            overrides: { name: "Shopping", percentage: 7, order: 2 }
          }),
          budgetCategoryDetailsBuilder.one({
            traits: ["wants"],
            overrides: { name: "Subscriptions", percentage: 5, order: 3 }
          })
        ])
      }
    },
    savings: {
      overrides: {
        type: "savings",
        percentage: 20,
        label: "Savings",
        categories: perBuild(() => [
          budgetCategoryDetailsBuilder.one({
            traits: ["savings"],
            overrides: { name: "Emergency Fund", percentage: 10, order: 0 }
          }),
          budgetCategoryDetailsBuilder.one({
            traits: ["savings"],
            overrides: { name: "Investments", percentage: 7, order: 1 }
          }),
          budgetCategoryDetailsBuilder.one({
            traits: ["savings"],
            overrides: { name: "Retirement", percentage: 3, order: 2 }
          })
        ])
      }
    }
  }
});

/**
 * Builder for generating OnboardingBudgetDetails (BudgetDetailsFormData) test data.
 *
 * @example
 * // Basic usage (using .one())
 * const budgetDetails = onboardingBudgetDetailsBuilder.one();
 *
 * @example
 * // Alternative usage (direct call)
 * const budgetDetails = onboardingBudgetDetailsBuilder();
 *
 * @example
 * // Override specific fields
 * const customBudgetDetails = onboardingBudgetDetailsBuilder.one({
 *   overrides: {
 *     monthlyIncome: 10000,
 *     budgetProfileId: "family"
 *   }
 * });
 *
 * @example
 * // Using traits
 * const youngProfessional = onboardingBudgetDetailsBuilder.one({ traits: ["youngProfessional"] });
 * const family = onboardingBudgetDetailsBuilder.one({ traits: ["family"] });
 * const aggressiveSaver = onboardingBudgetDetailsBuilder.one({ traits: ["aggressiveSaver"] });
 * const student = onboardingBudgetDetailsBuilder.one({ traits: ["student"] });
 * const balanced = onboardingBudgetDetailsBuilder.one({ traits: ["balanced"] });
 */
export const onboardingBudgetDetailsBuilder = build<OnboardingBudgetDetails>({
  fields: {
    budgetProfileId: perBuild(() =>
      faker.helpers.arrayElement(["young_professional", "family", "aggressive_saver", "student", "custom"])
    ),
    monthlyIncome: perBuild(() => faker.number.int({ min: 3000, max: 20000, multipleOf: 100 })),
    allocations: perBuild(() => [
      budgetAllocationBuilder.one({ traits: ["needs"] }),
      budgetAllocationBuilder.one({ traits: ["wants"] }),
      budgetAllocationBuilder.one({ traits: ["savings"] })
    ]),
    totalAllocated: perBuild(() => faker.number.int({ min: 3000, max: 20000, multipleOf: 100 })),
    totalPercentage: 100,
    remainingAmount: 0
  },
  traits: {
    youngProfessional: {
      overrides: {
        budgetProfileId: "young_professional",
        monthlyIncome: perBuild(() => faker.number.int({ min: 5000, max: 10000, multipleOf: 100 })),
        allocations: perBuild(() => {
          const income = faker.number.int({ min: 5000, max: 10000, multipleOf: 100 });
          return [
            budgetAllocationBuilder.one({ traits: ["needs"], overrides: { amount: Math.round(income * 0.5) } }),
            budgetAllocationBuilder.one({ traits: ["wants"], overrides: { amount: Math.round(income * 0.3) } }),
            budgetAllocationBuilder.one({ traits: ["savings"], overrides: { amount: Math.round(income * 0.2) } })
          ];
        }),
        totalPercentage: 100,
        remainingAmount: 0
      }
    },
    family: {
      overrides: {
        budgetProfileId: "family",
        monthlyIncome: perBuild(() => faker.number.int({ min: 8000, max: 15000, multipleOf: 100 })),
        allocations: perBuild(() => {
          const income = faker.number.int({ min: 8000, max: 15000, multipleOf: 100 });
          return [
            budgetAllocationBuilder.one({
              traits: ["needs"],
              overrides: { percentage: 60, amount: Math.round(income * 0.6) }
            }),
            budgetAllocationBuilder.one({
              traits: ["wants"],
              overrides: { percentage: 20, amount: Math.round(income * 0.2) }
            }),
            budgetAllocationBuilder.one({
              traits: ["savings"],
              overrides: { percentage: 20, amount: Math.round(income * 0.2) }
            })
          ];
        }),
        totalPercentage: 100,
        remainingAmount: 0
      }
    },
    aggressiveSaver: {
      overrides: {
        budgetProfileId: "aggressive_saver",
        monthlyIncome: perBuild(() => faker.number.int({ min: 6000, max: 12000, multipleOf: 100 })),
        allocations: perBuild(() => {
          const income = faker.number.int({ min: 6000, max: 12000, multipleOf: 100 });
          return [
            budgetAllocationBuilder.one({
              traits: ["needs"],
              overrides: { percentage: 40, amount: Math.round(income * 0.4) }
            }),
            budgetAllocationBuilder.one({
              traits: ["wants"],
              overrides: { percentage: 10, amount: Math.round(income * 0.1) }
            }),
            budgetAllocationBuilder.one({
              traits: ["savings"],
              overrides: { percentage: 50, amount: Math.round(income * 0.5) }
            })
          ];
        }),
        totalPercentage: 100,
        remainingAmount: 0
      }
    },
    student: {
      overrides: {
        budgetProfileId: "student",
        monthlyIncome: perBuild(() => faker.number.int({ min: 2000, max: 5000, multipleOf: 100 })),
        allocations: perBuild(() => {
          const income = faker.number.int({ min: 2000, max: 5000, multipleOf: 100 });
          return [
            budgetAllocationBuilder.one({
              traits: ["needs"],
              overrides: { percentage: 60, amount: Math.round(income * 0.6) }
            }),
            budgetAllocationBuilder.one({
              traits: ["wants"],
              overrides: { percentage: 25, amount: Math.round(income * 0.25) }
            }),
            budgetAllocationBuilder.one({
              traits: ["savings"],
              overrides: { percentage: 15, amount: Math.round(income * 0.15) }
            })
          ];
        }),
        totalPercentage: 100,
        remainingAmount: 0
      }
    },
    balanced: {
      overrides: {
        budgetProfileId: "custom",
        monthlyIncome: perBuild(() => faker.number.int({ min: 5000, max: 15000, multipleOf: 100 })),
        allocations: perBuild(() => {
          const income = faker.number.int({ min: 5000, max: 15000, multipleOf: 100 });
          return [
            budgetAllocationBuilder.one({
              traits: ["needs"],
              overrides: { percentage: 50, amount: Math.round(income * 0.5) }
            }),
            budgetAllocationBuilder.one({
              traits: ["wants"],
              overrides: { percentage: 30, amount: Math.round(income * 0.3) }
            }),
            budgetAllocationBuilder.one({
              traits: ["savings"],
              overrides: { percentage: 20, amount: Math.round(income * 0.2) }
            })
          ];
        }),
        totalPercentage: 100,
        remainingAmount: 0
      }
    },
    withRemainingAmount: {
      overrides: {
        totalPercentage: perBuild(() => faker.number.int({ min: 80, max: 95 })),
        remainingAmount: perBuild(() => faker.number.int({ min: 100, max: 1000, multipleOf: 50 }))
      }
    }
  }
});

/**
 * Helper functions for common budget details test scenarios.
 */
export const createTestBudgetDetails = {
  /**
   * Create budget details for a young professional (50/30/20 split)
   */
  youngProfessional: () => onboardingBudgetDetailsBuilder.one({ traits: ["youngProfessional"] }),

  /**
   * Create budget details for a family (60/20/20 split)
   */
  family: () => onboardingBudgetDetailsBuilder.one({ traits: ["family"] }),

  /**
   * Create budget details for an aggressive saver (40/10/50 split)
   */
  aggressiveSaver: () => onboardingBudgetDetailsBuilder.one({ traits: ["aggressiveSaver"] }),

  /**
   * Create budget details for a student (60/25/15 split)
   */
  student: () => onboardingBudgetDetailsBuilder.one({ traits: ["student"] }),

  /**
   * Create balanced budget details (50/30/20 split with custom profile)
   */
  balanced: () => onboardingBudgetDetailsBuilder.one({ traits: ["balanced"] }),

  /**
   * Create budget details with a specific monthly income
   */
  withIncome: (monthlyIncome: number) => {
    const allocations = [
      budgetAllocationBuilder.one({ traits: ["needs"], overrides: { amount: Math.round(monthlyIncome * 0.5) } }),
      budgetAllocationBuilder.one({ traits: ["wants"], overrides: { amount: Math.round(monthlyIncome * 0.3) } }),
      budgetAllocationBuilder.one({ traits: ["savings"], overrides: { amount: Math.round(monthlyIncome * 0.2) } })
    ];
    return onboardingBudgetDetailsBuilder.one({
      overrides: {
        monthlyIncome,
        allocations,
        totalAllocated: monthlyIncome,
        remainingAmount: 0
      }
    });
  },

  /**
   * Create budget details for a specific profile
   */
  forProfile: (profileId: string) =>
    onboardingBudgetDetailsBuilder.one({
      overrides: { budgetProfileId: profileId }
    })
};
