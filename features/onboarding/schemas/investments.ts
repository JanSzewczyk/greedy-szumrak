import { z } from "zod";

import { BrokerId } from "~/features/onboarding/constants/investments";

export const investmentAccountSchema = z
  .object({
    brokerId: z.enum(BrokerId).nonoptional(),
    name: z.string().min(2, "Account name is required").nullable(),
    number: z.string().min(2, "Account number is required"),
    currency: z.string().min(1, "Currency is required")
  })
  .refine(
    ({ brokerId, name }) => {
      if (brokerId === BrokerId.OTHER) {
        return !!name;
      }
      return true;
    },
    {
      message: "Please provide an account name for 'Other' broker",
      path: ["accountName"]
    }
  );

export type InvestmentAccountSchemaFormData = z.infer<typeof investmentAccountSchema>;
