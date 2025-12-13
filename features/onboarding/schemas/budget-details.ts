import { z } from "zod";

import { type IconName } from "lucide-react/dynamic";
import { AllocationType, type BudgetTemplate } from "~/features/budget/types/budget-template";

/**
 * Schema for individual budget category within an allocation
 * Matches BudgetCategoryTemplate structure with additional amount field for user input
 */
export const budgetCategoryDetailsSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().nullable().default(null),
  icon: z.custom<IconName>().nonoptional(),
  color: z.string().min(1, "Color is required"),
  amount: z.number().min(0, "Amount must be at least 0"),
  examples: z.array(z.string()).optional()
});

/**
 * Schema for allocation group (needs, wants, or savings)
 * Matches TemplateAllocation structure
 */
export const budgetAllocationSchema = z
  .object({
    type: z.enum(AllocationType, { message: "Invalid allocation type" }),
    targetAmount: z.number({ message: "Target amount must be a number" }).min(0, "Target amount must be at least 0"),
    label: z.string({ message: "Label is required" }).min(1, "Label is required"),
    categories: z
      .array(budgetCategoryDetailsSchema, { message: "Categories must be an array" })
      .min(1, "At least one category is required")
  })
  .refine(
    ({ targetAmount, categories }) => {
      const totalCategoriesAmount = categories.reduce((sum, cat) => sum + (cat.amount || 0), 0);
      return totalCategoriesAmount <= targetAmount;
    },
    {
      message: "Total categories amount exceeds target allocation",
      path: ["categories"]
    }
  );

/**
 * Main budget details form schema
 * Creates data structure similar to BudgetTemplate allocations
 */
export const budgetDetailsSchema = z
  .object({
    /** Monthly income used for calculations */
    monthlyIncome: z.number().min(1, "Monthly income must be greater than 0"),
    /** Budget allocations grouped by type (needs, wants, savings) */
    allocations: z.array(budgetAllocationSchema).min(1, "At least one allocation is required")
  })
  .refine(
    ({ monthlyIncome, allocations }) => {
      const totalAllocated = allocations.reduce(
        (sum, allocation) => sum + allocation.categories.reduce((catSum, cat) => catSum + (cat.amount || 0), 0),
        0
      );
      return totalAllocated >= monthlyIncome;
    },
    {
      message: "Add categories to allocate your entire income",
      path: ["allocations"]
    }
  );

export type BudgetCategoryDetailsFormData = z.input<typeof budgetCategoryDetailsSchema>;
export type BudgetAllocationFormData = z.input<typeof budgetAllocationSchema>;
export type BudgetDetailsFormData = z.input<typeof budgetDetailsSchema>;

/**
 * Helper function to transform BudgetTemplate to form default values
 */
export function templateToFormDefaults(template: BudgetTemplate, monthlyIncome: number): BudgetDetailsFormData {
  const allocations: Array<BudgetAllocationFormData> = template.allocations.map((allocation) => ({
    type: allocation.type,
    targetAmount: Math.round((monthlyIncome * allocation.percentage) / 100),
    label: allocation.label,
    categories: allocation.categories.map((category) => ({
      name: category.name,
      description: category.description,
      icon: category.icon,
      color: category.color,
      amount: Math.round((monthlyIncome * category.percentage) / 100),
      examples: category.examples
    }))
  }));

  return {
    monthlyIncome,
    allocations
  };
}
