import { z } from "zod";

export const budgetChooseTemplateSchema = z.object({
  monthlyIncome: z.number().min(0),
  budgetProfile: z.string()
});

export type BudgetChooseTemplateFormData = z.infer<typeof budgetChooseTemplateSchema>;
