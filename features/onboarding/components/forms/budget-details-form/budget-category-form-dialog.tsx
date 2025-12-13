import * as React from "react";

import { useForm, type DefaultValues } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Separator
} from "@szum-tech/design-system";
import { BudgetCategoryPreview } from "~/features/budget/components/budget-category-preview";
import { BudgetCategoryFormFields } from "~/features/budget/components/forms/budget-category-form-fields";
import { type BudgetCategoryFormData, budgetCategorySchema } from "~/features/budget/schemas/budget-category";

export type BudgetCategoryFormDialogProps = {
  onClose: () => void;
  defaultValues?: DefaultValues<BudgetCategoryFormData>;
  onSubmit: (data: BudgetCategoryFormData) => void;
  mode?: "create" | "edit";
};

export function BudgetCategoryFormDialog({
  onClose,
  defaultValues,
  onSubmit,
  mode = "create"
}: BudgetCategoryFormDialogProps) {
  const form = useForm<BudgetCategoryFormData>({
    resolver: zodResolver(budgetCategorySchema),
    defaultValues
  });

  function handleSubmit(data: BudgetCategoryFormData) {
    onSubmit(data);
    form.reset();
    onClose();
  }

  function handleClose() {
    form.reset();
    onClose();
  }

  return (
    <Dialog defaultOpen onOpenChange={handleClose}>
      <DialogContent width="lg" showCloseButton className="flex max-h-[calc(100%-1rem)] flex-1 flex-col">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Add New Category" : "Edit Category"}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Create a new budget category to track your expenses."
              : "Update the category details."}
          </DialogDescription>
        </DialogHeader>

        <div className="-mr-3 -ml-1 min-h-0 flex-1 overflow-y-auto px-1">
          <BudgetCategoryFormFields form={form} />

          {mode === "edit" ? (
            <div className="space-y-3 py-6">
              <Separator />
              <h3 className="text-heading-h4 text-center">Preview:</h3>
              <BudgetCategoryPreview category={form.watch()} />
            </div>
          ) : null}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="button" loading={form.formState.isSubmitting} onClick={form.handleSubmit(handleSubmit)}>
            {mode === "create" ? "Add Category" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
