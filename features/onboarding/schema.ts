import { z } from "zod";

export const preferencesSchema = z.object({
  currency: z
    .string({ message: "Please select your preferred currency" })
    .min(1, "Please select your preferred currency"),
  dateFormat: z
    .string({ message: "Please select your preferred date format" })
    .min(1, "Please select your preferred date format")
});

export type PreferencesFormData = z.infer<typeof preferencesSchema>;

export const productsSchema = z.object({ budget: z.boolean(), investment: z.boolean() });

export type ProductsFormData = z.infer<typeof productsSchema>;
