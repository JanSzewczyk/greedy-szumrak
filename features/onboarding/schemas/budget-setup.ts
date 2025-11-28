import { z } from "zod";

export const budgetSetupSchema = z.object({
  monthlyIncome: z
    .number("Please enter a valid monthly income greater than 0")
    .min(1, 'Please enter a valid monthly income greater than 0"'),
  budgetProfile: z.string("Please select a budget profile")
});

export type BudgetSetupFormData = z.input<typeof budgetSetupSchema>;
