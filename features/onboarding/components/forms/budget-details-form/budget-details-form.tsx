"use client";

import * as React from "react";

import { clsx } from "clsx";
import { ChevronRightIcon, PlusIcon, TrashIcon } from "lucide-react";
import { type DefaultValues, useFieldArray, useForm, useWatch } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
  Input,
  Item,
  Progress,
  toast
} from "@szum-tech/design-system";
import { DynamicIcon } from "lucide-react/dynamic";
import { type BudgetTemplate } from "~/features/budget/types/budget-template";
import { BudgetCategoryFormDialog } from "~/features/onboarding/components/forms/budget-details-form/budget-category-form-dialog";
import {
  type BudgetDetailsFormData,
  budgetDetailsSchema,
  templateToFormDefaults
} from "~/features/onboarding/schemas/budget-details";
import { type OnboardingPreferences } from "~/features/onboarding/types/onboarding";
import { type RedirectAction } from "~/lib/action-types";
import { formatMoney } from "~/utils/format-money";

export type BudgetDetailsFormProps = {
  budgetTemplate?: BudgetTemplate;
  monthlyIncome: number;
  onBackAction(): void;
  onContinueAction(data: BudgetDetailsFormData): RedirectAction;
  defaultValues?: DefaultValues<BudgetDetailsFormData> | null;
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
  const computedDefaultValues = React.useMemo(() => {
    if (defaultValues) {
      return defaultValues;
    }
    if (budgetTemplate) {
      return templateToFormDefaults(budgetTemplate, monthlyIncome);
    }
    return {
      monthlyIncome,
      allocations: []
    };
  }, [defaultValues, budgetTemplate, monthlyIncome]);

  const form = useForm<BudgetDetailsFormData>({
    defaultValues: computedDefaultValues,
    resolver: zodResolver(budgetDetailsSchema)
  });

  const { fields: allocationFields } = useFieldArray({
    control: form.control,
    name: "allocations"
  });

  const watchedAllocations = useWatch({
    control: form.control,
    name: "allocations"
  });

  const { totalAllocated, remainingAmount, percentage } = React.useMemo(() => {
    const total = (watchedAllocations ?? []).reduce(
      (sum, allocation) => sum + allocation.categories.reduce((catSum, cat) => catSum + (cat.amount || 0), 0),
      0
    );

    return {
      totalAllocated: total,
      remainingAmount: monthlyIncome - total,
      percentage: Math.min(100, Math.round((total / monthlyIncome) * 100))
    };
  }, [watchedAllocations, monthlyIncome]);

  async function handleSubmit(data: BudgetDetailsFormData) {
    const result = await onContinueAction(data);
    if (!result.success) {
      toast.error(result.error);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="container-xl mt-2">
      <FieldSet>
        <FieldLegend>Budget Details</FieldLegend>
        <FieldDescription>
          Configure budget amounts for each category based on <strong>{budgetTemplate?.name ?? "custom"}</strong>{" "}
          template for {formatMoney(monthlyIncome, { currency, decimals: 0 })}
        </FieldDescription>

        {/* Summary Section */}
        <Item variant="muted">
          <div className="w-full justify-between">
            <div className="mb-2 flex items-center justify-between">
              <span className="">Total monthly budget</span>
              <span className="text-heading-h4">{formatMoney(totalAllocated, { currency, decimals: 0 })}</span>
            </div>
            <Progress value={percentage} max={100} className="h-2" />
            <div className="text-muted-foreground text-body-xs mt-1 flex justify-between">
              <span>Allocated: {formatMoney(totalAllocated, { currency, decimals: 0 })}</span>
              <span
                className={clsx("transition-colors duration-500", remainingAmount < 0 ? "text-error" : "text-success")}
              >
                Remaining: {formatMoney(remainingAmount, { currency, decimals: 0 })}
              </span>
            </div>
          </div>
        </Item>

        {/* Allocations grouped by type */}
        {allocationFields.map((allocation, allocationIndex) => {
          const watchedAllocation = watchedAllocations[allocationIndex];
          if (!watchedAllocation) return null;

          return (
            <AllocationSection
              key={allocation.id}
              allocationIndex={allocationIndex}
              allocation={watchedAllocation}
              monthlyIncome={monthlyIncome}
              currency={currency}
              form={form}
            />
          );
        })}

        {form.formState.errors.allocations ? <FieldError errors={[form.formState.errors.allocations]} /> : null}
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

type AllocationSectionProps = {
  allocationIndex: number;
  allocation: BudgetDetailsFormData["allocations"][number];
  monthlyIncome: number;
  currency: string;
  form: ReturnType<typeof useForm<BudgetDetailsFormData>>;
};

function AllocationSection({ allocationIndex, allocation, monthlyIncome, currency, form }: AllocationSectionProps) {
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `allocations.${allocationIndex}.categories`
  });

  const allocationTarget = allocation.targetAmount;
  const allocationAmount = allocation.categories.reduce((sum, category) => sum + (category.amount || 0), 0);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-heading-h4">
            {allocation.label} ({(allocationTarget / monthlyIncome) * 100}%)
          </span>
        </div>
        <div
          className={clsx(
            "text-body-sm transition-colors duration-500",
            allocationAmount > allocationTarget
              ? "text-error"
              : allocationAmount === allocationTarget
                ? "text-success"
                : ""
          )}
        >
          Allocated:{" "}
          <strong>
            {formatMoney(allocationAmount, { currency, decimals: 0 })}/
            {formatMoney(allocationTarget, { currency, decimals: 0 })}
          </strong>
        </div>
      </div>

      <FieldGroup className="gap-3">
        {fields.map((field, categoryIndex) => {
          const category = allocation.categories[categoryIndex];

          return (
            <React.Fragment key={field.id}>
              <FieldSeparator />
              <Field orientation="responsive">
                <FieldContent className="flex-row items-center gap-3">
                  {category?.icon ? (
                    <div
                      className="flex size-10 items-center justify-center rounded"
                      style={{ backgroundColor: category.color + "20" }}
                    >
                      <DynamicIcon name={category.icon} className="size-5" style={{ color: category.color }} />
                    </div>
                  ) : null}
                  <div className="flex-1">
                    <FieldTitle>{category?.name}</FieldTitle>
                    {category?.description && <FieldDescription>{category.description}</FieldDescription>}
                  </div>
                </FieldContent>
                <div className="flex items-center gap-2">
                  <Input
                    className="sm:w-28"
                    type="number"
                    aria-label={`Amount for ${category?.name}`}
                    invalid={
                      !!form.formState.errors.allocations?.[allocationIndex]?.categories?.[categoryIndex]?.amount
                    }
                    placeholder={formatMoney(0, { currency, decimals: 0 })}
                    {...form.register(`allocations.${allocationIndex}.categories.${categoryIndex}.amount`, {
                      valueAsNumber: true
                    })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(categoryIndex)}
                    disabled={fields.length === 1}
                    aria-label={`Remove ${category?.name}`}
                  >
                    <TrashIcon className="size-4" />
                  </Button>
                </div>
              </Field>
            </React.Fragment>
          );
        })}

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          disabled={allocationAmount >= allocationTarget}
          startIcon={<PlusIcon />}
        >
          Add Category
        </Button>

        {isAddModalOpen ? (
          <BudgetCategoryFormDialog
            onClose={() => setIsAddModalOpen(false)}
            onSubmit={(data) => {
              append(data);
            }}
            defaultValues={{
              remainingAmount: allocationTarget - allocationAmount
            }}
          />
        ) : null}
      </FieldGroup>
    </div>
  );
}
