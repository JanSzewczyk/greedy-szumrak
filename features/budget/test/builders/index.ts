/**
 * Budget feature test data builders
 *
 * This module exports builders for generating mock data for budget-related types.
 * All builders use @jackfranklin/test-data-bot and @faker-js/faker/locale/pl.
 *
 * @example
 * // Import individual builders
 * import { budgetTemplateBuilder, budgetCategoryTemplateBuilder } from "~/features/budget/test/builders";
 *
 * // Use in tests
 * const template = budgetTemplateBuilder.one();
 * const youngProfessional = budgetTemplateBuilder.one({ traits: ["youngProfessional"] });
 *
 * @example
 * // Use helper functions
 * import { createTestBudgetTemplate } from "~/features/budget/test/builders";
 *
 * const youngProfessional = createTestBudgetTemplate.youngProfessional();
 * const allTemplates = createTestBudgetTemplate.all();
 */

export { budgetCategoryTemplateBuilder } from "./budget-category-template.builder";
export { templateAllocationBuilder } from "./template-allocation.builder";
export { budgetTemplateBuilder, budgetTemplateBaseBuilder, createTestBudgetTemplate } from "./budget-template.builder";
