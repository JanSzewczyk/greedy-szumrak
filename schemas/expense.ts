import * as z from "zod";

export type ExpenseFormType = z.infer<typeof expenseSchema>;

export const expenseSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(2).optional(),
  date: z.string(),
  amount: z.number().positive(),
  columnId: z.string()
});
