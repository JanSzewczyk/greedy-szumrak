"use client";

import * as React from "react";

import { ChevronRightIcon, PlusIcon, TrashIcon } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  CardContent,
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  Input,
  Select,
  SelectContent,
  SelectItem,
  toast
} from "@szum-tech/design-system";
import { type BudgetTemplate } from "~/features/budget/types/budget-template";
import { type BudgetDetailsFormData, budgetDetailsSchema } from "~/features/onboarding/shemas/budget-details";
import { type OnboardingPreferences } from "~/features/onboarding/types/onboarding";
import { type RedirectAction } from "~/lib/action-types";
import { formatMoney } from "~/utils/format-money";

export type BudgetDetailsFormProps = {
  budgetTemplate?: BudgetTemplate;
  monthlyIncome: number;
  onBackAction(): void;
  onContinueAction(data: BudgetDetailsFormData): RedirectAction;
  defaultValues?: BudgetDetailsFormData;
  preferences: OnboardingPreferences;
};

export function BudgetDetailsForm({
  budgetTemplate,
  monthlyIncome,
  onContinueAction,
  onBackAction,
  defaultValues,
  preferences: { currency }
}: BudgetDetailsFormProps) {
  const form = useForm<BudgetDetailsFormData>({
    defaultValues: defaultValues ?? {
      categories: budgetTemplate?.allocations.flatMap((allocation) =>
        allocation.categories.map((category) => ({
          categoryId: category.id,
          amount: Math.round((monthlyIncome * category.percentage) / 100),
          percentage: category.percentage
        }))
      ) ?? [],
      totalAllocated: monthlyIncome,
      remainingAmount: 0
    },
    resolver: zodResolver(budgetDetailsSchema)
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "categories"
  });

  const watchedCategories = form.watch("categories");
  const totalAllocated = React.useMemo(() => {
    return watchedCategories.reduce((sum, cat) => sum + (cat.amount || 0), 0);
  }, [watchedCategories]);

  const remainingAmount = monthlyIncome - totalAllocated;

  React.useEffect(() => {
    form.setValue("totalAllocated", totalAllocated);
    form.setValue("remainingAmount", remainingAmount);
  }, [totalAllocated, remainingAmount, form]);

  async function handleSubmit(data: BudgetDetailsFormData) {
    const result = await onContinueAction(data);
    if (!result.success) {
      toast.error(result.error);
    }
  }

  const allCategories = budgetTemplate?.allocations.flatMap((allocation) => allocation.categories) ?? [];

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="container-xl mt-2">
      <FieldSet>
        <FieldLegend>Budget Details</FieldLegend>
        <FieldDescription>
          Configure budget amounts for each category based on your monthly income of{" "}
          {formatMoney(monthlyIncome, { currency, decimals: 0 })}
        </FieldDescription>

        <FieldGroup>
          <Card>
            <CardContent>
              <div className="mb-4 flex justify-between rounded bg-muted p-4">
                <div>
                  <div className="text-mute text-sm">Total Allocated</div>
                  <div className="text-body-lg">{formatMoney(totalAllocated, { currency, decimals: 0 })}</div>
                </div>
                <div>
                  <div className="text-mute text-sm">Remaining</div>
                  <div
                    className="text-body-lg"
                    style={{
                      color: remainingAmount < 0 ? "var(--color-error)" : "var(--color-success)"
                    }}
                  >
                    {formatMoney(remainingAmount, { currency, decimals: 0 })}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => {
                  const category = allCategories.find((cat) => cat.id === field.categoryId);

                  return (
                    <div key={field.id} className="flex gap-4 rounded border p-4">
                      <div className="flex-1">
                        <Controller
                          control={form.control}
                          name={`categories.${index}.categoryId`}
                          render={({ field: fieldProps, fieldState }) => (
                            <Field data-invalid={!!fieldState.error}>
                              <FieldLabel>Category</FieldLabel>
                              <Select
                                value={fieldProps.value}
                                onValueChange={fieldProps.onChange}
                                placeholder="Select category"
                                invalid={!!fieldState.error}
                              >
                                <SelectContent>
                                  {allCategories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id}>
                                      {cat.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FieldError errors={[fieldState.error]} />
                            </Field>
                          )}
                        />
                        {category?.description && (
                          <FieldDescription className="mt-1">{category.description}</FieldDescription>
                        )}
                      </div>

                      <div className="w-32">
                        <Field data-invalid={!!form.formState.errors.categories?.[index]?.amount}>
                          <FieldLabel>Amount</FieldLabel>
                          <Input
                            type="number"
                            invalid={!!form.formState.errors.categories?.[index]?.amount}
                            placeholder="0"
                            {...form.register(`categories.${index}.amount`, {
                              valueAsNumber: true,
                              onChange: (e) => {
                                const amount = parseFloat(e.target.value) || 0;
                                const percentage = (amount / monthlyIncome) * 100;
                                form.setValue(`categories.${index}.percentage`, Math.round(percentage * 100) / 100);
                              }
                            })}
                          />
                          <FieldError errors={[form.formState.errors.categories?.[index]?.amount]} />
                        </Field>
                      </div>

                      <div className="w-24">
                        <Field data-invalid={!!form.formState.errors.categories?.[index]?.percentage}>
                          <FieldLabel>%</FieldLabel>
                          <Input
                            type="number"
                            invalid={!!form.formState.errors.categories?.[index]?.percentage}
                            placeholder="0"
                            {...form.register(`categories.${index}.percentage`, {
                              valueAsNumber: true,
                              onChange: (e) => {
                                const percentage = parseFloat(e.target.value) || 0;
                                const amount = Math.round((monthlyIncome * percentage) / 100);
                                form.setValue(`categories.${index}.amount`, amount);
                              }
                            })}
                          />
                          <FieldError errors={[form.formState.errors.categories?.[index]?.percentage]} />
                        </Field>
                      </div>

                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                          disabled={fields.length === 1}
                        >
                          <TrashIcon className="size-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    append({
                      categoryId: "",
                      amount: 0,
                      percentage: 0
                    })
                  }
                  startIcon={<PlusIcon />}
                >
                  Add Category
                </Button>
              </div>
            </CardContent>
          </Card>
        </FieldGroup>
      </FieldSet>

      <div className="mt-10 flex justify-between">
        <Button type="button" variant="outline" onClick={onBackAction}>
          Back
        </Button>

        <Button type="submit" loading={form.formState.isSubmitting} endIcon={<ChevronRightIcon />}>
          Continue
        </Button>
      </div>
    </form>
  );
}
