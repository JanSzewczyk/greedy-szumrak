"use client";

import * as React from "react";

import { ChevronRightIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Badge,
  Button,
  Card,
  CardContent,
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
  Input,
  RadioGroup,
  RadioGroupItem,
  toast
} from "@szum-tech/design-system";
import { type BudgetTemplate } from "~/features/budget/types/budget-template";
import { type BudgetSetupFormData, budgetSetupSchema } from "~/features/onboarding/schemas/budget-setup";
import { type OnboardingPreferences } from "~/features/onboarding/types/onboarding";
import { type RedirectAction } from "~/lib/action-types";
import { formatMoney } from "~/utils/format-money";

export type BudgetSetupFormProps = {
  budgetTemplates?: Array<BudgetTemplate>;
  onBackAction(): void;
  onContinueAction(data: BudgetSetupFormData): RedirectAction;
  defaultValues?: BudgetSetupFormData;
  preferences: OnboardingPreferences;
};

export function BudgetSetupForm({
  budgetTemplates = [],
  onContinueAction,
  onBackAction,
  defaultValues,
  preferences: { currency }
}: BudgetSetupFormProps) {
  const form = useForm({
    defaultValues,
    resolver: zodResolver(budgetSetupSchema)
  });

  const [displayedMonthlyIncome, setDisplayedMonthlyIncome] = React.useState<number | null>(
    defaultValues ? defaultValues.monthlyIncome : null
  );

  async function handleIncomeBlur() {
    const monthlyIncome = form.watch("monthlyIncome");

    // Trigger validation for the monthlyIncome field only
    const isValid = form.formState.isValid || !form.formState.errors.monthlyIncome;
    const hasValue = !!monthlyIncome && monthlyIncome > 0;

    if (isValid && hasValue) {
      setDisplayedMonthlyIncome(monthlyIncome);
    }
  }

  async function handleSubmit(data: BudgetSetupFormData) {
    const result = await onContinueAction(data);
    if (!result.success) {
      toast.error(result.error);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="container-xl mt-2">
      <FieldSet>
        <FieldLegend>Set up budgets</FieldLegend>
        <FieldDescription>Choose a template or start from scratch</FieldDescription>

        <FieldGroup>
          <Card>
            <CardContent>
              <Field data-invalid={!!form.formState.errors.monthlyIncome}>
                <FieldLabel htmlFor="monthly-income">What is your monthly net income?</FieldLabel>
                <Input
                  id="monthly-income"
                  invalid={!!form.formState.errors.monthlyIncome}
                  placeholder={formatMoney(8000, {
                    currency,
                    decimals: 0
                  })}
                  type="number"
                  {...form.register("monthlyIncome", {
                    valueAsNumber: true,
                    onBlur: handleIncomeBlur
                  })}
                />
                <FieldDescription>We&#39;ll help you suggest appropriate budgets</FieldDescription>
                <FieldError errors={[form.formState.errors.monthlyIncome]} />
              </Field>
            </CardContent>
          </Card>

          {!!displayedMonthlyIncome ? (
            <Controller
              control={form.control}
              name="budgetProfile"
              render={({ field: { onChange, ...fieldProps }, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>Choose a budget template:</FieldLabel>
                  <RadioGroup onValueChange={onChange} {...fieldProps}>
                    {budgetTemplates.map((template) => (
                      <FieldLabel key={template.id}>
                        <Field orientation="horizontal">
                          <RadioGroupItem value={template.id} />
                          <FieldContent>
                            <FieldTitle>
                              {template.name}
                              {template.isRecommended ? (
                                <div>
                                  <Badge>Recommended</Badge>
                                </div>
                              ) : null}
                            </FieldTitle>
                            <FieldDescription>{template.description}</FieldDescription>
                            <ul className={`mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3`}>
                              {template.allocations.map((allocation) => (
                                <li key={allocation.label} className="bg-card w-full rounded px-2 py-1">
                                  <div className="text-mute text-xs">
                                    {allocation.label} - {allocation.percentage}%
                                  </div>
                                  <div className="text-body-lg text-card-foreground truncate">
                                    {formatMoney(displayedMonthlyIncome * (allocation.percentage / 100), {
                                      currency: "PLN",
                                      decimals: 0
                                    })}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </FieldContent>
                        </Field>
                      </FieldLabel>
                    ))}
                    <FieldLabel>
                      <Field orientation="horizontal">
                        <RadioGroupItem value="custom" />
                        <FieldContent>
                          <FieldTitle>Custom Template</FieldTitle>
                          <FieldDescription>Define categories and amounts according to your needs</FieldDescription>
                        </FieldContent>
                      </Field>
                    </FieldLabel>
                  </RadioGroup>
                  <FieldError />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          ) : null}
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
