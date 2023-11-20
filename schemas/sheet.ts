import * as z from "zod";

export type CreateSheetFormType = z.infer<typeof createSheetSchema>;

export const createSheetSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(2).optional(),
  currency: z.string()
});
