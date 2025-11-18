import { faker } from "@faker-js/faker/locale/pl";
import { build, perBuild } from "@jackfranklin/test-data-bot";
import { type TemplateAllocation } from "~/features/budget/types/budget-template";

import { budgetCategoryTemplateBuilder } from "./budget-category-template.builder";

/**
 * Builder for generating TemplateAllocation test data.
 *
 * @example
 * // Basic usage (using .one())
 * const allocation = templateAllocationBuilder.one();
 *
 * @example
 * // Alternative usage (direct call)
 * const allocation = templateAllocationBuilder();
 *
 * @example
 * // Override specific fields
 * const needs = templateAllocationBuilder.one({
 *   overrides: {
 *     type: "needs",
 *     percentage: 50
 *   }
 * });
 *
 * @example
 * // Using traits
 * const needs = templateAllocationBuilder.one({ traits: ["needs"] });
 * const wants = templateAllocationBuilder.one({ traits: ["wants"] });
 * const savings = templateAllocationBuilder.one({ traits: ["savings"] });
 *
 * @example
 * // Create 50/30/20 allocation set
 * const allocations = [
 *   templateAllocationBuilder.one({ traits: ["needs"] }),
 *   templateAllocationBuilder.one({ traits: ["wants"] }),
 *   templateAllocationBuilder.one({ traits: ["savings"] })
 * ];
 */
export const templateAllocationBuilder = build<TemplateAllocation>({
  fields: {
    type: perBuild(() => faker.helpers.arrayElement(["needs", "wants", "savings"] as const)),
    percentage: perBuild(() => faker.number.int({ min: 10, max: 60 })),
    label: perBuild(() => faker.helpers.arrayElement(["Needs", "Wants", "Savings"])),
    categories: perBuild(() =>
      Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, () => budgetCategoryTemplateBuilder.one())
    )
  },
  traits: {
    needs: {
      overrides: {
        type: "needs",
        percentage: 50,
        label: "Needs",
        categories: perBuild(() => [
          budgetCategoryTemplateBuilder.one({ traits: ["housing"] }),
          budgetCategoryTemplateBuilder.one({ traits: ["groceries"] }),
          budgetCategoryTemplateBuilder.one({ traits: ["transportation"] }),
          budgetCategoryTemplateBuilder.one({ traits: ["health"] })
        ])
      }
    },
    wants: {
      overrides: {
        type: "wants",
        percentage: 30,
        label: "Wants",
        categories: perBuild(() => [
          budgetCategoryTemplateBuilder.one({ traits: ["entertainment"] }),
          budgetCategoryTemplateBuilder.one({ traits: ["diningOut"] }),
          budgetCategoryTemplateBuilder.one({ traits: ["shopping"] })
        ])
      }
    },
    savings: {
      overrides: {
        type: "savings",
        percentage: 20,
        label: "Savings",
        categories: perBuild(() => [
          budgetCategoryTemplateBuilder.one({ traits: ["savings"] }),
          budgetCategoryTemplateBuilder.one({ traits: ["investments"] })
        ])
      }
    },
    aggressiveSavings: {
      overrides: {
        type: "savings",
        percentage: 50,
        label: "Savings",
        categories: perBuild(() => [
          budgetCategoryTemplateBuilder.one({
            traits: ["savings"],
            overrides: { percentage: 30 }
          }),
          budgetCategoryTemplateBuilder.one({
            traits: ["investments"],
            overrides: { percentage: 20 }
          })
        ])
      }
    },
    familyNeeds: {
      overrides: {
        type: "needs",
        percentage: 60,
        label: "Needs",
        categories: perBuild(() => [
          budgetCategoryTemplateBuilder.one({
            traits: ["housing"],
            overrides: { percentage: 30 }
          }),
          budgetCategoryTemplateBuilder.one({
            traits: ["groceries"],
            overrides: { percentage: 15 }
          }),
          budgetCategoryTemplateBuilder.one({
            traits: ["transportation"],
            overrides: { percentage: 10 }
          }),
          budgetCategoryTemplateBuilder.one({
            traits: ["health"],
            overrides: { percentage: 5 }
          })
        ])
      }
    }
  }
});
