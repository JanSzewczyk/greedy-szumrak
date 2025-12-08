import * as React from "react";

import { clsx } from "clsx";
import { Controller, type UseFormReturn } from "react-hook-form";

import {
  ColorSwatch,
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  RadioGroup,
  RadioGroupItem,
  Textarea
} from "@szum-tech/design-system";
import { DynamicIcon } from "lucide-react/dynamic";
import { type BudgetCategoryFormData } from "~/features/budget/schemas/budget-category";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "~/features/onboarding/constants/budget-category";

export function BudgetCategoryFormFields({ form }: { form: UseFormReturn<BudgetCategoryFormData> }) {
  return (
    <FieldGroup>
      <Field data-invalid={!!form.formState.errors.name}>
        <FieldLabel htmlFor="category-name">Category Name</FieldLabel>
        <Input
          id="category-name"
          placeholder="e.g., Groceries, Rent, Entertainment"
          invalid={!!form.formState.errors.name}
          {...form.register("name")}
        />
        <FieldError errors={[form.formState.errors.name]} />
      </Field>

      <Field data-invalid={!!form.formState.errors.description}>
        <FieldLabel htmlFor="category-description">Description (Optional)</FieldLabel>
        <Textarea
          id="category-description"
          placeholder="Brief description of what this category covers"
          rows={2}
          {...form.register("description", { setValueAs: (value) => value || null })}
        />
        <FieldError errors={[form.formState.errors.description]} />
      </Field>

      <Controller
        control={form.control}
        name="icon"
        render={({ field: { onChange, value, ...fieldProps }, fieldState }) => (
          <Field data-invalid={!!fieldState.error}>
            <FieldLabel>Icon</FieldLabel>
            <RadioGroup
              onValueChange={onChange}
              value={value}
              {...fieldProps}
              className="grid grid-cols-4 gap-2 sm:grid-cols-8"
            >
              {CATEGORY_ICONS.map((icon) => (
                <FieldLabel key={icon.id} className="">
                  <Field className="flex size-10 items-center justify-center !p-0">
                    <RadioGroupItem value={icon.id} className="hidden" />
                    <DynamicIcon name={icon.id} className={clsx(value === icon.id ? "text-primary" : "", "size-5")} />
                  </Field>
                </FieldLabel>
              ))}
            </RadioGroup>
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="color"
        render={({ field, fieldState: { error } }) => (
          <Field data-invalid={!!error}>
            <FieldLabel>Color</FieldLabel>
            <div className="mx-auto grid grid-cols-4 gap-2 sm:grid-cols-8">
              {CATEGORY_COLORS.map((color) => (
                <ColorSwatch key={color.id} className={color.id === field.value ? "ring-primary ring-2" : ""} asChild>
                  <button
                    type="button"
                    title={color.label}
                    onClick={() => field.onChange(color.id)}
                    style={{ backgroundColor: color.id }}
                  />
                </ColorSwatch>
              ))}
            </div>

            <FieldError errors={[error]} />
          </Field>
        )}
      />

      <Field data-invalid={!!form.formState.errors.amount}>
        <FieldLabel htmlFor="category-amount">Amount</FieldLabel>
        <Input
          id="category-amount"
          type="number"
          min={0}
          placeholder="0"
          invalid={!!form.formState.errors.amount}
          {...form.register("amount", { valueAsNumber: true })}
        />
        <FieldError errors={[form.formState.errors.amount]} />
      </Field>

      <Controller
        control={form.control}
        name="examples"
        render={({ field: { onChange, value: _val, ...field }, fieldState }) => (
          <Field aria-invalid={!!fieldState.error}>
            <FieldLabel htmlFor="category-examples">Examples (Optional)</FieldLabel>
            <Input
              id="category-examples"
              placeholder="e.g., Rent, Electricity, Water"
              invalid={!!fieldState.error}
              onChange={(e) =>
                onChange(
                  e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                )
              }
              {...field}
            />
            <FieldDescription>Comma-separated list of example expenses for this category</FieldDescription>
          </Field>
        )}
      />
    </FieldGroup>
  );
}
