import { faker } from "@faker-js/faker/locale/pl";
import { build, perBuild } from "@jackfranklin/test-data-bot";
import { type IconName } from "lucide-react/dynamic";
import { DEFAULT_BUDGET_TEMPLATES } from "~/features/budget/data/predefined-budget-templates";
import { BudgetProfile, type BudgetTemplate, type BudgetTemplateBase } from "~/features/budget/types/budget-template";
import {
  type BudgetAllocationFormData,
  type BudgetCategoryDetailsFormData,
  type BudgetDetailsFormData,
  templateToFormDefaults
} from "~/features/onboarding/schemas/budget-details";

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

// Helper to convert BudgetTemplateBase to BudgetTemplate
const toTemplate = (base: BudgetTemplateBase): BudgetTemplate => ({
  ...base,
  createdAt: new Date(),
  updatedAt: new Date()
});

// Get predefined templates
const getTemplate = (profileId: BudgetProfile): BudgetTemplate => {
  const base = DEFAULT_BUDGET_TEMPLATES.find((t) => t.id === profileId) ?? DEFAULT_BUDGET_TEMPLATES[0]!;
  return toTemplate(base);
};

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
    amount: perBuild(() => faker.number.int({ min: 100, max: 2000, multipleOf: 50 })),
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
    targetAmount: perBuild(() => faker.number.int({ min: 500, max: 5000, multipleOf: 100 })),
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
        label: "Needs",
        categories: perBuild(() => [
          budgetCategoryDetailsBuilder.one({ traits: ["needs"], overrides: { name: "Housing" } }),
          budgetCategoryDetailsBuilder.one({ traits: ["needs"], overrides: { name: "Groceries" } }),
          budgetCategoryDetailsBuilder.one({ traits: ["needs"], overrides: { name: "Utilities" } }),
          budgetCategoryDetailsBuilder.one({ traits: ["needs"], overrides: { name: "Transportation" } })
        ])
      }
    },
    wants: {
      overrides: {
        type: "wants",
        label: "Wants",
        categories: perBuild(() => [
          budgetCategoryDetailsBuilder.one({ traits: ["wants"], overrides: { name: "Entertainment" } }),
          budgetCategoryDetailsBuilder.one({ traits: ["wants"], overrides: { name: "Dining Out" } }),
          budgetCategoryDetailsBuilder.one({ traits: ["wants"], overrides: { name: "Shopping" } }),
          budgetCategoryDetailsBuilder.one({ traits: ["wants"], overrides: { name: "Subscriptions" } })
        ])
      }
    },
    savings: {
      overrides: {
        type: "savings",
        label: "Savings",
        categories: perBuild(() => [
          budgetCategoryDetailsBuilder.one({ traits: ["savings"], overrides: { name: "Emergency Fund" } }),
          budgetCategoryDetailsBuilder.one({ traits: ["savings"], overrides: { name: "Investments" } }),
          budgetCategoryDetailsBuilder.one({ traits: ["savings"], overrides: { name: "Retirement" } })
        ])
      }
    }
  }
});

/**
 * Builder for generating BudgetDetailsFormData test data.
 * Uses real predefined budget templates from DEFAULT_BUDGET_TEMPLATES.
 *
 * @example
 * // Basic usage (using .one())
 * const budgetDetails = onboardingBudgetDetailsBuilder.one();
 *
 * @example
 * // Using traits with real template data
 * const youngProfessional = onboardingBudgetDetailsBuilder.one({ traits: ["youngProfessional"] });
 * const family = onboardingBudgetDetailsBuilder.one({ traits: ["family"] });
 * const aggressiveSaver = onboardingBudgetDetailsBuilder.one({ traits: ["aggressiveSaver"] });
 * const student = onboardingBudgetDetailsBuilder.one({ traits: ["student"] });
 */
export const onboardingBudgetDetailsBuilder = build<BudgetDetailsFormData>({
  fields: {
    monthlyIncome: perBuild(() => faker.number.int({ min: 3000, max: 20000, multipleOf: 100 })),
    allocations: perBuild(() => [
      budgetAllocationBuilder.one({ traits: ["needs"] }),
      budgetAllocationBuilder.one({ traits: ["wants"] }),
      budgetAllocationBuilder.one({ traits: ["savings"] })
    ])
  },
  traits: {
    youngProfessional: {
      overrides: {
        monthlyIncome: perBuild(() => faker.number.int({ min: 4000, max: 8000, multipleOf: 100 })),
        allocations: perBuild(() => {
          const income = faker.number.int({ min: 4000, max: 8000, multipleOf: 100 });
          return templateToFormDefaults(getTemplate(BudgetProfile.YOUNG_PROFESSIONAL), income).allocations;
        })
      }
    },
    family: {
      overrides: {
        monthlyIncome: perBuild(() => faker.number.int({ min: 6000, max: 15000, multipleOf: 100 })),
        allocations: perBuild(() => {
          const income = faker.number.int({ min: 6000, max: 15000, multipleOf: 100 });
          return templateToFormDefaults(getTemplate(BudgetProfile.FAMILY), income).allocations;
        })
      }
    },
    aggressiveSaver: {
      overrides: {
        monthlyIncome: perBuild(() => faker.number.int({ min: 5000, max: 20000, multipleOf: 100 })),
        allocations: perBuild(() => {
          const income = faker.number.int({ min: 5000, max: 20000, multipleOf: 100 });
          return templateToFormDefaults(getTemplate(BudgetProfile.AGGRESSIVE_SAVER), income).allocations;
        })
      }
    },
    student: {
      overrides: {
        monthlyIncome: perBuild(() => faker.number.int({ min: 1000, max: 3000, multipleOf: 100 })),
        allocations: perBuild(() => {
          const income = faker.number.int({ min: 1000, max: 3000, multipleOf: 100 });
          return templateToFormDefaults(getTemplate(BudgetProfile.STUDENT), income).allocations;
        })
      }
    }
  }
});

/**
 * Helper functions for common budget details test scenarios.
 * All helpers use real predefined budget template data.
 */
export const createTestBudgetDetails = {
  /**
   * Create budget details for a young professional (50/30/20 split)
   * Uses real Young Professional template data
   */
  youngProfessional: (income = 6000) => templateToFormDefaults(getTemplate(BudgetProfile.YOUNG_PROFESSIONAL), income),

  /**
   * Create budget details for a family (60/20/20 split)
   * Uses real Family template data
   */
  family: (income = 10000) => templateToFormDefaults(getTemplate(BudgetProfile.FAMILY), income),

  /**
   * Create budget details for an aggressive saver (40/10/50 split)
   * Uses real Aggressive Saver template data
   */
  aggressiveSaver: (income = 8000) => templateToFormDefaults(getTemplate(BudgetProfile.AGGRESSIVE_SAVER), income),

  /**
   * Create budget details for a student (60/25/15 split)
   * Uses real Student template data
   */
  student: (income = 2000) => templateToFormDefaults(getTemplate(BudgetProfile.STUDENT), income),

  /**
   * Create budget details with a specific monthly income using Young Professional template
   */
  withIncome: (monthlyIncome: number) =>
    templateToFormDefaults(getTemplate(BudgetProfile.YOUNG_PROFESSIONAL), monthlyIncome),

  /**
   * Create budget details for a specific profile
   */
  forProfile: (profileId: BudgetProfile, income: number) => templateToFormDefaults(getTemplate(profileId), income)
};
