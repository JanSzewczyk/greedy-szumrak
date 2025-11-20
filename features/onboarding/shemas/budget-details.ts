import { z } from "zod";

export const budgetCategoryDetailsSchema = z.object({
  categoryId: z.string(),
  amount: z.number().min(0, "Amount must be at least 0"),
  percentage: z.number().min(0).max(100)
});

export const budgetDetailsSchema = z.object({
  categories: z.array(budgetCategoryDetailsSchema).min(1, "At least one category is required"),
  totalAllocated: z.number().min(0),
  remainingAmount: z.number()
});

export type BudgetCategoryDetailsFormData = z.infer<typeof budgetCategoryDetailsSchema>;
export type BudgetDetailsFormData = z.infer<typeof budgetDetailsSchema>;
