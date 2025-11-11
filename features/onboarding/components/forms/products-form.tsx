"use client";

import { ChevronRightIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Checkbox,
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle
} from "@szum-tech/design-system";
import { type ProductsFormData, productsSchema } from "~/features/onboarding/schema";
import { type RedirectAction } from "~/lib/action-types";

export type ProductsFormProps = {
  defaultValues?: ProductsFormData;
  onContinueAction(data: ProductsFormData): RedirectAction;
};

export function ProductsForm({ defaultValues, onContinueAction }: ProductsFormProps) {
  const hasDefaultValues = !!defaultValues;

  const {
    handleSubmit,
    control,
    formState: { isSubmitting }
  } = useForm({
    resolver: zodResolver(productsSchema),
    defaultValues: defaultValues ?? { budget: true, investment: false }
  });

  async function onSubmit(data: ProductsFormData) {
    await onContinueAction(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <FieldSet>
          <FieldTitle>What do you want to configure?</FieldTitle>

          <Controller
            control={control}
            name="budget"
            render={({ field: { value, onChange, ...rest } }) => (
              <FieldLabel htmlFor="budget-4gd3">
                <Field orientation="horizontal">
                  <Checkbox id="budget-4gd3" checked={value} onCheckedChange={onChange} {...rest} />
                  <FieldContent>
                    <FieldTitle>Monthly budgets</FieldTitle>
                    <FieldDescription>Recommended for all users</FieldDescription>
                  </FieldContent>
                </Field>
              </FieldLabel>
            )}
          />

          <Controller
            control={control}
            name="investment"
            render={({ field: { value, onChange, ...rest } }) => (
              <FieldLabel htmlFor="investment-23gh5">
                <Field orientation="horizontal">
                  <Checkbox id="investment-23gh5" checked={value} onCheckedChange={onChange} {...rest} />
                  <FieldContent>
                    <FieldTitle>Investment accounts</FieldTitle>
                    <FieldDescription>Optional - you can add later</FieldDescription>
                  </FieldContent>
                </Field>
              </FieldLabel>
            )}
          />
        </FieldSet>
      </FieldGroup>

      <div className="mt-8 flex justify-end">
        <Button type="submit" fullWidth={!hasDefaultValues} loading={isSubmitting} endIcon={<ChevronRightIcon />}>
          {hasDefaultValues ? "Continue" : "Get Started"}
        </Button>
      </div>
    </form>
  );
}
