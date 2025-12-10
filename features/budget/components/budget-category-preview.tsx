import { TrashIcon } from "lucide-react";

import { Button, Field, FieldContent, FieldDescription, FieldGroup, FieldTitle, Input } from "@szum-tech/design-system";
import { DynamicIcon } from "lucide-react/dynamic";
import { type BudgetCategoryFormData } from "~/features/budget/schemas/budget-category";

export function BudgetCategoryPreview({ category }: { category: BudgetCategoryFormData }) {
  return (
    <FieldGroup inert>
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
            aria-label={`Preview Amount for ${category?.name}`}
            placeholder="0"
            defaultValue={category?.amount || ""}
          />
          <Button type="button" variant="ghost" size="sm" aria-label={`Preview Remove ${category?.name}`}>
            <TrashIcon className="size-4" />
          </Button>
        </div>
      </Field>
    </FieldGroup>
  );
}
