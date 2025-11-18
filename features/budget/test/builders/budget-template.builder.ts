import { faker } from "@faker-js/faker/locale/pl";
import { build, perBuild } from "@jackfranklin/test-data-bot";
import { type IconName } from "lucide-react/dynamic";
import { BudgetProfile, type BudgetTemplate, type BudgetTemplateBase } from "~/features/budget/types/budget-template";
import { templateAllocationBuilder } from "./template-allocation.builder";

/**
 * Builder for generating BudgetTemplateBase test data (without timestamps).
 *
 * @example
 * // Basic usage (using .one())
 * const template = budgetTemplateBaseBuilder.one();
 *
 * @example
 * // Alternative usage (direct call)
 * const template = budgetTemplateBaseBuilder();
 *
 * @example
 * // Override specific fields
 * const custom = budgetTemplateBaseBuilder.one({
 *   overrides: {
 *     name: "Custom Budget",
 *     isRecommended: true
 *   }
 * });
 *
 * @example
 * // Using traits
 * const youngProfessional = budgetTemplateBaseBuilder.one({ traits: ["youngProfessional"] });
 * const family = budgetTemplateBaseBuilder.one({ traits: ["family"] });
 * const aggressiveSaver = budgetTemplateBaseBuilder.one({ traits: ["aggressiveSaver"] });
 * const student = budgetTemplateBaseBuilder.one({ traits: ["student"] });
 */
export const budgetTemplateBaseBuilder = build<BudgetTemplateBase>({
  fields: {
    id: perBuild(() => faker.helpers.arrayElement(Object.values(BudgetProfile))),
    name: perBuild(() => faker.person.jobTitle()),
    description: perBuild(() => faker.lorem.sentence()),
    icon: perBuild(() =>
      faker.helpers.arrayElement(["briefcase", "users", "trending-up", "graduation-cap", "settings"] as IconName[])
    ),
    targetIncome: {
      min: perBuild(() => faker.number.int({ min: 3000, max: 6000 })),
      max: perBuild(() => faker.number.int({ min: 8000, max: 15000 }))
    },
    characteristics: perBuild(() =>
      faker.helpers.arrayElements(
        [
          "Stable employment",
          "No dependents",
          "City living",
          "Active lifestyle",
          "Career focused",
          "Family oriented",
          "Budget conscious",
          "Long-term planning"
        ],
        { min: 3, max: 6 }
      )
    ),
    allocations: perBuild(() => [
      templateAllocationBuilder.one({ traits: ["needs"] }),
      templateAllocationBuilder.one({ traits: ["wants"] }),
      templateAllocationBuilder.one({ traits: ["savings"] })
    ]),
    totalPercentage: 100,
    isActive: true,
    isRecommended: false
  },
  traits: {
    youngProfessional: {
      overrides: {
        id: BudgetProfile.YOUNG_PROFESSIONAL,
        name: "Young Professional",
        description: "For people starting their professional career who want to balance work life with enjoyment and building their future.",
        icon: "briefcase",
        targetIncome: {
          min: 4000,
          max: 8000
        },
        characteristics: ["Stable employment", "No dependents", "City living", "Active lifestyle", "Investing in career development"],
        allocations: perBuild(() => [
          templateAllocationBuilder.one({ traits: ["needs"] }),
          templateAllocationBuilder.one({ traits: ["wants"] }),
          templateAllocationBuilder.one({ traits: ["savings"] })
        ]),
        isRecommended: true
      }
    },
    family: {
      overrides: {
        id: BudgetProfile.FAMILY,
        name: "Family",
        description: "For families with children who need to prioritize basic needs while planning for the future.",
        icon: "users",
        targetIncome: {
          min: 6000,
          max: 12000
        },
        characteristics: ["Children", "Homeowners or renting larger space", "Education costs", "Healthcare priority", "Family activities"],
        allocations: perBuild(() => [
          templateAllocationBuilder.one({ traits: ["familyNeeds"] }),
          templateAllocationBuilder.one({
            traits: ["wants"],
            overrides: { percentage: 20 }
          }),
          templateAllocationBuilder.one({
            traits: ["savings"],
            overrides: { percentage: 20 }
          })
        ]),
        isRecommended: false
      }
    },
    aggressiveSaver: {
      overrides: {
        id: BudgetProfile.AGGRESSIVE_SAVER,
        name: "Aggressive Saver",
        description: "For people who want to maximize savings and achieve financial independence quickly (FIRE approach).",
        icon: "trending-up",
        targetIncome: {
          min: 5000,
          max: 10000
        },
        characteristics: ["Minimalist lifestyle", "Strong financial discipline", "Long-term goals", "Investment focused", "FIRE oriented"],
        allocations: perBuild(() => [
          templateAllocationBuilder.one({
            traits: ["needs"],
            overrides: { percentage: 40 }
          }),
          templateAllocationBuilder.one({
            traits: ["wants"],
            overrides: { percentage: 10 }
          }),
          templateAllocationBuilder.one({ traits: ["aggressiveSavings"] })
        ]),
        isRecommended: false
      }
    },
    student: {
      overrides: {
        id: BudgetProfile.STUDENT,
        name: "Student",
        description: "For students and people just starting out with limited income who need to maximize every złoty.",
        icon: "graduation-cap",
        targetIncome: {
          min: 2000,
          max: 4000
        },
        characteristics: ["Limited income", "Shared living", "Public transportation", "Budget conscious", "Learning to manage money"],
        allocations: perBuild(() => [
          templateAllocationBuilder.one({
            traits: ["needs"],
            overrides: { percentage: 60 }
          }),
          templateAllocationBuilder.one({
            traits: ["wants"],
            overrides: { percentage: 25 }
          }),
          templateAllocationBuilder.one({
            traits: ["savings"],
            overrides: { percentage: 15 }
          })
        ]),
        isRecommended: false
      }
    },
    custom: {
      overrides: {
        id: BudgetProfile.CUSTOM,
        name: "Custom",
        description: "Create your own budget allocation from scratch.",
        icon: "settings",
        targetIncome: {
          min: 0,
          max: 999999
        },
        characteristics: ["Fully customizable", "Your own rules", "Flexible approach"],
        allocations: [],
        totalPercentage: 0,
        isRecommended: false
      }
    },
    inactive: {
      overrides: {
        isActive: false
      }
    },
    recommended: {
      overrides: {
        isRecommended: true
      }
    }
  }
});

/**
 * Builder for generating BudgetTemplate test data (with timestamps).
 *
 * @example
 * // Basic usage (using .one())
 * const template = budgetTemplateBuilder.one();
 *
 * @example
 * // Alternative usage (direct call)
 * const template = budgetTemplateBuilder();
 *
 * @example
 * // Override specific fields
 * const custom = budgetTemplateBuilder.one({
 *   overrides: {
 *     id: BudgetProfile.CUSTOM,
 *     name: "My Custom Budget"
 *   }
 * });
 *
 * @example
 * // Generate multiple templates
 * const templates = Array.from({ length: 5 }, () => budgetTemplateBuilder.one());
 *
 * @example
 * // Using traits
 * const youngProfessional = budgetTemplateBuilder.one({ traits: ["youngProfessional"] });
 * const family = budgetTemplateBuilder.one({ traits: ["family"] });
 * const aggressiveSaver = budgetTemplateBuilder.one({ traits: ["aggressiveSaver"] });
 * const student = budgetTemplateBuilder.one({ traits: ["student"] });
 * const custom = budgetTemplateBuilder.one({ traits: ["custom"] });
 *
 * @example
 * // Combining traits
 * const inactiveTemplate = budgetTemplateBuilder.one({
 *   traits: ["youngProfessional", "inactive"]
 * });
 */
export const budgetTemplateBuilder = build<BudgetTemplate>({
  fields: {
    id: perBuild(() => faker.helpers.arrayElement(Object.values(BudgetProfile))),
    name: perBuild(() => faker.person.jobTitle()),
    description: perBuild(() => faker.lorem.sentence()),
    icon: perBuild(() =>
      faker.helpers.arrayElement(["briefcase", "users", "trending-up", "graduation-cap", "settings"] as IconName[])
    ),
    targetIncome: {
      min: perBuild(() => faker.number.int({ min: 3000, max: 6000 })),
      max: perBuild(() => faker.number.int({ min: 8000, max: 15000 }))
    },
    characteristics: perBuild(() =>
      faker.helpers.arrayElements(
        [
          "Stable employment",
          "No dependents",
          "City living",
          "Active lifestyle",
          "Career focused",
          "Family oriented",
          "Budget conscious",
          "Long-term planning"
        ],
        { min: 3, max: 6 }
      )
    ),
    allocations: perBuild(() => [
      templateAllocationBuilder.one({ traits: ["needs"] }),
      templateAllocationBuilder.one({ traits: ["wants"] }),
      templateAllocationBuilder.one({ traits: ["savings"] })
    ]),
    totalPercentage: 100,
    isActive: true,
    isRecommended: false,
    createdAt: perBuild(() => faker.date.past()),
    updatedAt: perBuild(() => faker.date.recent())
  },
  traits: {
    youngProfessional: {
      overrides: {
        id: BudgetProfile.YOUNG_PROFESSIONAL,
        name: "Young Professional",
        description: "For people starting their professional career who want to balance work life with enjoyment and building their future.",
        icon: "briefcase",
        targetIncome: {
          min: 4000,
          max: 8000
        },
        characteristics: ["Stable employment", "No dependents", "City living", "Active lifestyle", "Investing in career development"],
        allocations: perBuild(() => [
          templateAllocationBuilder.one({ traits: ["needs"] }),
          templateAllocationBuilder.one({ traits: ["wants"] }),
          templateAllocationBuilder.one({ traits: ["savings"] })
        ]),
        isRecommended: true
      }
    },
    family: {
      overrides: {
        id: BudgetProfile.FAMILY,
        name: "Family",
        description: "For families with children who need to prioritize basic needs while planning for the future.",
        icon: "users",
        targetIncome: {
          min: 6000,
          max: 12000
        },
        characteristics: ["Children", "Homeowners or renting larger space", "Education costs", "Healthcare priority", "Family activities"],
        allocations: perBuild(() => [
          templateAllocationBuilder.one({ traits: ["familyNeeds"] }),
          templateAllocationBuilder.one({
            traits: ["wants"],
            overrides: { percentage: 20 }
          }),
          templateAllocationBuilder.one({
            traits: ["savings"],
            overrides: { percentage: 20 }
          })
        ]),
        isRecommended: false
      }
    },
    aggressiveSaver: {
      overrides: {
        id: BudgetProfile.AGGRESSIVE_SAVER,
        name: "Aggressive Saver",
        description: "For people who want to maximize savings and achieve financial independence quickly (FIRE approach).",
        icon: "trending-up",
        targetIncome: {
          min: 5000,
          max: 10000
        },
        characteristics: ["Minimalist lifestyle", "Strong financial discipline", "Long-term goals", "Investment focused", "FIRE oriented"],
        allocations: perBuild(() => [
          templateAllocationBuilder.one({
            traits: ["needs"],
            overrides: { percentage: 40 }
          }),
          templateAllocationBuilder.one({
            traits: ["wants"],
            overrides: { percentage: 10 }
          }),
          templateAllocationBuilder.one({ traits: ["aggressiveSavings"] })
        ]),
        isRecommended: false
      }
    },
    student: {
      overrides: {
        id: BudgetProfile.STUDENT,
        name: "Student",
        description: "For students and people just starting out with limited income who need to maximize every złoty.",
        icon: "graduation-cap",
        targetIncome: {
          min: 2000,
          max: 4000
        },
        characteristics: ["Limited income", "Shared living", "Public transportation", "Budget conscious", "Learning to manage money"],
        allocations: perBuild(() => [
          templateAllocationBuilder.one({
            traits: ["needs"],
            overrides: { percentage: 60 }
          }),
          templateAllocationBuilder.one({
            traits: ["wants"],
            overrides: { percentage: 25 }
          }),
          templateAllocationBuilder.one({
            traits: ["savings"],
            overrides: { percentage: 15 }
          })
        ]),
        isRecommended: false
      }
    },
    custom: {
      overrides: {
        id: BudgetProfile.CUSTOM,
        name: "Custom",
        description: "Create your own budget allocation from scratch.",
        icon: "settings",
        targetIncome: {
          min: 0,
          max: 999999
        },
        characteristics: ["Fully customizable", "Your own rules", "Flexible approach"],
        allocations: [],
        totalPercentage: 0,
        isRecommended: false
      }
    },
    inactive: {
      overrides: {
        isActive: false
      }
    },
    recommended: {
      overrides: {
        isRecommended: true
      }
    }
  }
});

/**
 * Helper functions for common budget template test scenarios.
 */
export const createTestBudgetTemplate = {
  /**
   * Create a Young Professional template (50/30/20 split)
   */
  youngProfessional: () => budgetTemplateBuilder.one({ traits: ["youngProfessional"] }),

  /**
   * Create a Family template (60/20/20 split)
   */
  family: () => budgetTemplateBuilder.one({ traits: ["family"] }),

  /**
   * Create an Aggressive Saver template (40/10/50 split)
   */
  aggressiveSaver: () => budgetTemplateBuilder.one({ traits: ["aggressiveSaver"] }),

  /**
   * Create a Student template (60/25/15 split)
   */
  student: () => budgetTemplateBuilder.one({ traits: ["student"] }),

  /**
   * Create a Custom template (empty allocations)
   */
  custom: () => budgetTemplateBuilder.one({ traits: ["custom"] }),

  /**
   * Create all predefined templates (without custom)
   */
  allPredefined: () => [
    budgetTemplateBuilder.one({ traits: ["youngProfessional"] }),
    budgetTemplateBuilder.one({ traits: ["family"] }),
    budgetTemplateBuilder.one({ traits: ["aggressiveSaver"] }),
    budgetTemplateBuilder.one({ traits: ["student"] })
  ],

  /**
   * Create all templates including custom
   */
  all: () => [
    budgetTemplateBuilder.one({ traits: ["youngProfessional"] }),
    budgetTemplateBuilder.one({ traits: ["family"] }),
    budgetTemplateBuilder.one({ traits: ["aggressiveSaver"] }),
    budgetTemplateBuilder.one({ traits: ["student"] }),
    budgetTemplateBuilder.one({ traits: ["custom"] })
  ],

  /**
   * Create multiple templates
   */
  list: (count: number) => Array.from({ length: count }, () => budgetTemplateBuilder.one()),

  /**
   * Create a recommended template
   */
  recommended: () =>
    budgetTemplateBuilder.one({
      traits: ["youngProfessional", "recommended"]
    }),

  /**
   * Create an inactive template
   */
  inactive: () =>
    budgetTemplateBuilder.one({
      traits: ["youngProfessional", "inactive"]
    })
};
