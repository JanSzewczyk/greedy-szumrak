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
            <FieldLabel id="icon-group-label">Icon</FieldLabel>
            <RadioGroup
              onValueChange={onChange}
              value={value}
              aria-labelledby="icon-group-label"
              aria-invalid={!!fieldState.error}
              orientation="horizontal"
              className="grid grid-cols-4 place-items-center sm:grid-cols-8"
              {...fieldProps}
            >
              {CATEGORY_ICONS.map((icon) => (
                <label
                  key={icon.id}
                  className={clsx(
                    "flex size-10 cursor-pointer items-center justify-center rounded border transition-colors",
                    "hover:bg-accent",
                    "has-[:focus-visible]:border-ring has-[:focus-visible]:ring-ring/50 has-[:focus-visible]:ring-[3px]",
                    value === icon.id ? "border-primary bg-primary/10" : "border-transparent"
                  )}
                >
                  <RadioGroupItem value={icon.id} aria-label={icon.label} className="sr-only" />
                  <DynamicIcon
                    name={icon.id}
                    className={clsx(
                      "size-5 transition-colors",
                      value === icon.id ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                </label>
              ))}
            </RadioGroup>
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="color"
        render={({ field: { onChange, value, ...fieldProps }, fieldState: { error } }) => (
          <Field data-invalid={!!error}>
            <FieldLabel id="color-group-label">Color</FieldLabel>
            <RadioGroup
              onValueChange={onChange}
              value={value}
              aria-labelledby="color-group-label"
              aria-invalid={!!error}
              orientation="horizontal"
              className="grid grid-cols-8 place-items-center"
              {...fieldProps}
            >
              {CATEGORY_COLORS.map((color) => (
                <label
                  key={color.id}
                  className="has-[:focus-visible]:border-ring has-[:focus-visible]:ring-ring/50 flex-0 rounded border border-transparent has-[:focus-visible]:ring-[3px]"
                >
                  <RadioGroupItem value={color.id} aria-label={color.label} className="sr-only" />
                  <ColorSwatch
                    className={clsx("cursor-pointer transition-all", value === color.id ? "ring-primary ring-2" : "")}
                    style={{ backgroundColor: color.id }}
                  />
                </label>
              ))}
            </RadioGroup>
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
