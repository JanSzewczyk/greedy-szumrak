import * as z from "zod";

export type CreateColumnFormType = z.infer<typeof createColumnSchema>;

export const createColumnSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(2).optional(),
  orderIndex: z.number().int()
});
