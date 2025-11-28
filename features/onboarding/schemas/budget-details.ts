import { z } from "zod";

import { type IconName } from "lucide-react/dynamic";

/**
 * Allocation types matching BudgetTemplate structure
 */
export const AllocationTypes = {
  NEEDS: "needs",
  WANTS: "wants",
  SAVINGS: "savings"
} as const;
export type AllocationType = (typeof AllocationTypes)[keyof typeof AllocationTypes];

/**
 * Schema for individual budget category within an allocation
 * Matches BudgetCategoryTemplate structure with additional amount field for user input
 */
export const budgetCategoryDetailsSchema = z.object({
  id: z.string().min(1, "Category ID is required"),
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
  icon: z.custom<IconName>(),
  color: z.string().min(1, "Color is required"),
  percentage: z.number().min(0, "Percentage must be at least 0").max(100, "Percentage cannot exceed 100"),
  amount: z.number().min(0, "Amount must be at least 0"),
  order: z.number().int().min(0),
  examples: z.array(z.string()).optional()
});

/**
 * Schema for allocation group (needs, wants, or savings)
 * Matches TemplateAllocation structure
 */
export const budgetAllocationSchema = z.object({
  type: z.enum(["needs", "wants", "savings"]),
  percentage: z.number().min(0).max(100),
  amount: z.number().min(0),
  label: z.string().min(1, "Label is required"),
  categories: z.array(budgetCategoryDetailsSchema).min(1, "At least one category is required")
});

/**
 * Main budget details form schema
 * Creates data structure similar to BudgetTemplate allocations
 */
export const budgetDetailsSchema = z
  .object({
    /** Selected budget profile ID */
    budgetProfileId: z.string().min(1, "Budget profile is required"),
    /** Monthly income used for calculations */
    monthlyIncome: z.number().min(1, "Monthly income must be greater than 0"),
    /** Budget allocations grouped by type (needs, wants, savings) */
    allocations: z.array(budgetAllocationSchema).min(1, "At least one allocation is required"),
    /** Total amount allocated across all categories */
    totalAllocated: z.number().min(0),
    /** Total percentage allocated (should equal 100) */
    totalPercentage: z.number().min(0).max(100),
    /** Remaining amount from monthly income */
    remainingAmount: z.number()
  })
  .refine(
    (data) => {
      const categoriesPercentage = data.allocations.reduce(
        (sum, allocation) => sum + allocation.categories.reduce((catSum, category) => catSum + category.percentage, 0),
        0
      );
      return categoriesPercentage <= 100;
    },
    {
      message: "Total category percentages cannot exceed 100%",
      path: ["totalPercentage"]
    }
  );

export type BudgetCategoryDetailsFormData = z.input<typeof budgetCategoryDetailsSchema>;
export type BudgetAllocationFormData = z.input<typeof budgetAllocationSchema>;
export type BudgetDetailsFormData = z.input<typeof budgetDetailsSchema>;

/**
 * Helper function to transform BudgetTemplate to form default values
 */
export function templateToFormDefaults(
  template: {
    id: string;
    allocations: Array<{
      type: "needs" | "wants" | "savings";
      percentage: number;
      label: string;
      categories: Array<{
        id: string;
        name: string;
        description?: string;
        icon: IconName;
        color: string;
        percentage: number;
        order: number;
        examples?: string[];
      }>;
    }>;
    totalPercentage: number;
  },
  monthlyIncome: number
): BudgetDetailsFormData {
  const allocations: BudgetAllocationFormData[] = template.allocations.map((allocation) => ({
    type: allocation.type,
    percentage: allocation.percentage,
    amount: Math.round((monthlyIncome * allocation.percentage) / 100),
    label: allocation.label,
    categories: allocation.categories.map((category) => ({
      id: category.id,
      name: category.name,
      description: category.description,
      icon: category.icon,
      color: category.color,
      percentage: category.percentage,
      amount: Math.round((monthlyIncome * category.percentage) / 100),
      order: category.order,
      examples: category.examples
    }))
  }));

  const totalAllocated = allocations.reduce(
    (sum, allocation) => sum + allocation.categories.reduce((catSum, cat) => catSum + cat.amount, 0),
    0
  );

  return {
    budgetProfileId: template.id,
    monthlyIncome,
    allocations,
    totalAllocated,
    totalPercentage: template.totalPercentage,
    remainingAmount: monthlyIncome - totalAllocated
  };
}
