import { CheckCircle2Icon, XIcon } from "lucide-react";
import { Controller, type DefaultValues, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel
} from "@szum-tech/design-system";
import { currencyOptions } from "~/constants/currency";
import { BrokerId, brokers } from "~/features/onboarding/constants/investments";
import { investmentAccountSchema, type InvestmentAccountFormData } from "~/features/onboarding/schemas/investments";

export type InvestmentAccountCardFormProps = {
  mode?: "create" | "edit";
  defaultValues?: DefaultValues<InvestmentAccountFormData>;
  onSave: (data: InvestmentAccountFormData) => void;
  onCancel: () => void;
};

const popularBrokers = brokers.filter((b) => b.isPopular);
const otherBrokers = brokers.filter((b) => !b.isPopular);

/**
 * Render a form for creating or editing an investment account.
 *
 * Renders a card-styled form bound to a Zod-validated react-hook-form that collects broker, account name,
 * account number, and currency; submission invokes `onSave` with validated form data and cancel invokes `onCancel`.
 *
 * @param onSave - Callback invoked with the validated InvestmentAccountFormData when the form is submitted
 * @param onCancel - Callback invoked when the cancel action is triggered
 * @param mode - Form mode, `"create"` or `"edit"`, which adjusts headings and submit button label
 * @param defaultValues - Optional initial form values to populate the form
 * @returns The JSX element for the investment account card form
 */
export function InvestmentAccountCardForm({
  onSave,
  onCancel,
  mode = "create",
  defaultValues
}: InvestmentAccountCardFormProps) {
  const form = useForm<InvestmentAccountFormData>({
    resolver: zodResolver(investmentAccountSchema),
    defaultValues: defaultValues ?? {}
  });

  const brokerId = form.watch("brokerId");

  return (
    <form onSubmit={form.handleSubmit(onSave)}>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{mode === "edit" ? "Edit Account" : "Add New Account"}</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Controller
              name="brokerId"
              control={form.control}
              render={({ field: { onChange, ...fieldProps }, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="broker">Broker</FieldLabel>
                  <Select
                    id="broker"
                    placeholder="Select broker..."
                    onValueChange={onChange}
                    invalid={!!fieldState.error}
                    {...fieldProps}
                  >
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Popular</SelectLabel>
                        {popularBrokers.map((broker) => (
                          <SelectItem key={broker.id} value={broker.id}>
                            {broker.name}
                            <span className="text-mute">{broker.description}</span>
                          </SelectItem>
                        ))}
                      </SelectGroup>

                      <SelectGroup>
                        <SelectLabel>Others</SelectLabel>
                        {otherBrokers.map((broker) => (
                          <SelectItem key={broker.id} value={broker.id}>
                            {broker.name}
                            <span className="text-mute">{broker.description}</span>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Field data-invalid={!!form.formState.errors.name}>
              <FieldLabel htmlFor="name">
                Account Name {brokerId === BrokerId.OTHER ? "" : <span className="text-mute">(optional)</span>}
              </FieldLabel>
              <Input
                id="name"
                placeholder="e.g. Main Trading Account, Retirement Fund"
                type="text"
                invalid={!!form.formState.errors.name}
                {...form.register("name", {
                  setValueAs: (value) => value || null
                })}
              />
              <FieldDescription>Helps distinguish multiple accounts from the same broker</FieldDescription>
              <FieldError errors={[form.formState.errors.name]} />
            </Field>

            <Field data-invalid={!!form.formState.errors.number}>
              <FieldLabel htmlFor="account-number">Account Number</FieldLabel>
              <Input
                id="account-number"
                placeholder="123456789"
                type="text"
                invalid={!!form.formState.errors.number}
                {...form.register("number")}
              />
              <FieldError errors={[form.formState.errors.number]} />
            </Field>

            <Controller
              name="currency"
              control={form.control}
              render={({ field: { onChange, ...fieldProps }, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="currency">Currency</FieldLabel>
                  <Select
                    id="currency"
                    placeholder="Select currency..."
                    onValueChange={onChange}
                    invalid={!!fieldState.error}
                    {...fieldProps}
                  >
                    <SelectContent>
                      {currencyOptions.map((currency) => (
                        <SelectItem key={currency.value} value={currency.value}>
                          {currency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          </FieldGroup>
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            <XIcon />
            Cancel
          </Button>
          <Button type="submit">
            {mode === "edit" ? "Update Account" : "Add Account"} <CheckCircle2Icon />
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}