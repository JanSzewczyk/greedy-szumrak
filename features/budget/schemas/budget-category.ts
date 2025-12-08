import { z } from "zod";

import { type IconName } from "lucide-react/dynamic";

export const budgetCategorySchema = z
  .object({
    name: z.string().min(1, "Category name is required"),
    description: z.string().nullable().default(null),
    icon: z.custom<IconName>().nonoptional(),
    color: z.string().min(1, "Color is required"),
    amount: z.number().min(0, "Amount must be at least 0"),
    remainingAmount: z.number().min(0),
    examples: z.array(z.string()).default([])
  })
  .refine((data) => data.amount <= data.remainingAmount, {
    path: ["amount"],
    message: "Amount cannot exceed remaining amount"
  });

export type BudgetCategoryFormData = z.input<typeof budgetCategorySchema>;
