import { z } from "zod";

export const productsSchema = z.object({ budget: z.boolean(), investment: z.boolean() });

export type ProductsFormData = z.input<typeof productsSchema>;
