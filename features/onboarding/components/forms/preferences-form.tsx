"use client";

import { ChevronRightIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

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
  SelectItem
} from "@szum-tech/design-system";
import { currencyOptions, dateFormat } from "~/features/onboarding/constants/preferences";
import { type PreferencesFormData, preferencesSchema } from "~/features/onboarding/schema";

export type PreferencesFormProps = {
  defaultValues?: PreferencesFormData;
  onBackAction(): Promise<void> | void;
  onContinueAction(data: PreferencesFormData): Promise<void>;
};

export function PreferencesForm({ onBackAction, defaultValues, onContinueAction }: PreferencesFormProps) {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting }
  } = useForm({
    resolver: zodResolver(preferencesSchema),
    defaultValues
  });

  async function onSubmit(data: PreferencesFormData) {
    await onContinueAction(data);
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
            render={({ field: { onChange, ...fieldProps }, fieldState: { error } }) => (
              <Field>
                <FieldLabel htmlFor="currency">Currency</FieldLabel>
                <Select id="currency" placeholder="Select Your Currency" onValueChange={onChange} {...fieldProps}>
                  <SelectContent>
                    {currencyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={[error]} />
              </Field>
            )}
          />

          <Controller
            control={control}
            name="dateFormat"
            render={({ field: { onChange, ...fieldProps }, fieldState: { error } }) => (
              <Field>
                <FieldLabel htmlFor="dateFormat">Date Format</FieldLabel>
                <Select id="dateFormat" placeholder="Select Date Format" onValueChange={onChange} {...fieldProps}>
                  <SelectContent>
                    {dateFormat.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={[error]} />
              </Field>
            )}
          />
        </FieldGroup>
      </FieldSet>

      <div className="mt-10 flex justify-between">
        <Button type="button" variant="outline" onClick={onBackAction}>
          Back
        </Button>

        <Button type="submit" disabled={isSubmitting} endIcon={<ChevronRightIcon />}>
          Continue
        </Button>
      </div>
    </form>
  );
}
