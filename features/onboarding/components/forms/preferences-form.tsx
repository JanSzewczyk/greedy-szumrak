"use client";

import { ChevronRightIcon } from "lucide-react";
import { Controller, type DefaultValues, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  Select,
  SelectContent,
  SelectItem,
  toast
} from "@szum-tech/design-system";
import { currencyOptions } from "~/constants/currency";
import { dateFormat } from "~/features/onboarding/constants/preferences";
import { type PreferencesFormData, preferencesSchema } from "~/features/onboarding/schemas/preferences";
import { type RedirectAction } from "~/lib/action-types";

export type PreferencesFormProps = {
  defaultValues?: DefaultValues<PreferencesFormData> | null;
  onBackAction(): void;
  onContinueAction(data: PreferencesFormData): RedirectAction;
};

export function PreferencesForm({ onBackAction, defaultValues, onContinueAction }: PreferencesFormProps) {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting }
  } = useForm<PreferencesFormData>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: defaultValues ?? {}
  });

  async function onSubmit(data: PreferencesFormData) {
    const result = await onContinueAction(data);
    if (!result.success) {
      toast.error(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="container-xl mt-2">
      <FieldSet>
        <FieldLegend>Set Your Preferences</FieldLegend>
        <FieldDescription>Customize your experience</FieldDescription>

        <FieldGroup>
          <Controller
            control={control}
            name="currency"
            render={({ field: { onChange, ...fieldProps }, fieldState }) => (
              <Field aria-invalid={!!fieldState.error}>
                <FieldLabel htmlFor="currency">Currency</FieldLabel>
                <Select
                  id="currency"
                  placeholder="Select Your Currency"
                  onValueChange={onChange}
                  invalid={!!fieldState.error}
                  {...fieldProps}
                >
                  <SelectContent>
                    {currencyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Controller
            control={control}
            name="dateFormat"
            render={({ field: { onChange, ...fieldProps }, fieldState }) => (
              <Field aria-invalid={!!fieldState.error}>
                <FieldLabel htmlFor="dateFormat">Date Format</FieldLabel>
                <Select
                  id="dateFormat"
                  placeholder="Select Date Format"
                  onValueChange={onChange}
                  invalid={!!fieldState.error}
                  {...fieldProps}
                >
                  <SelectContent>
                    {dateFormat.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </FieldGroup>
      </FieldSet>

      <div className="mt-10 flex justify-between">
        <Button type="button" variant="outline" onClick={onBackAction}>
          Back
        </Button>

        <Button type="submit" loading={isSubmitting} endIcon={<ChevronRightIcon />}>
          Continue
        </Button>
      </div>
    </form>
  );
}
