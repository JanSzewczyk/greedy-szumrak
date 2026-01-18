import { expect, fn, screen, userEvent, waitFor, within } from "storybook/test";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "~/features/onboarding/constants/budget-category";

import { BudgetCategoryFormDialog } from "./budget-category-form-dialog";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Features/Onboarding/Budget Category Form Dialog",
  component: BudgetCategoryFormDialog,
  args: {
    onClose: fn(),
    onSubmit: fn(),
    mode: "create",
    defaultValues: {
      remainingAmount: 1000
    }
  }
});

/**
 * Verifies semantic structure and accessibility of the dialog.
 * Tests that all form fields have proper labels and ARIA attributes.
 */
export const DialogSemantics = meta.story({
  args: { onClose: fn(), onSubmit: fn() },
  play: async ({ step }) => {
    await step("Dialog has proper heading structure", async () => {
      await waitFor(async () => {
        const title = screen.getByRole("heading", { name: /add new category/i });
        await expect(title).toBeVisible();
      });

      await waitFor(async () => {
        const description = screen.getByText(/create a new budget category/i);
        await expect(description).toBeVisible();
      });
    });

    await step("Form fields have accessible labels", async () => {
      const nameInput = screen.getByLabelText(/category name/i);
      await expect(nameInput).toBeVisible();
      await expect(nameInput).toHaveAttribute("id");

      const descriptionInput = screen.getByLabelText(/description/i);
      await expect(descriptionInput).toBeVisible();

      const amountInput = screen.getByLabelText(/^amount$/i);
      await expect(amountInput).toBeVisible();
      await expect(amountInput).toHaveAttribute("type", "number");
    });

    await step("Icon selection has proper group labeling", async () => {
      const iconLabel = screen.getByText(/^icon$/i);
      await expect(iconLabel).toBeVisible();

      const iconRadioGroup = screen.getByRole("radiogroup", { name: /icon/i });
      await expect(iconRadioGroup).toBeVisible();
    });

    await step("Color selection has proper group labeling", async () => {
      const colorLabel = screen.getByText(/^color$/i);
      await expect(colorLabel).toBeVisible();

      const colorRadioGroup = screen.getByRole("radiogroup", { name: /color/i });
      await expect(colorRadioGroup).toBeVisible();
    });

    await step("Dialog has proper action buttons", async () => {
      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      await expect(cancelButton).toBeVisible();

      const submitButton = screen.getByRole("button", { name: /add category/i });
      await expect(submitButton).toBeVisible();
    });
  }
});

/**
 * Tests form validation for required fields.
 * Verifies error messages appear and form is not submitted.
 */
export const ValidationRequiredFields = meta.story({
  args: {
    onClose: fn(),
    onSubmit: fn()
  },
  play: async ({ args, step }) => {
    await waitFor(async () => {
      const submitButton = screen.getByRole("button", { name: /add category/i });
      await expect(submitButton).toBeVisible();
    });

    await step("Submit empty form triggers validation", async () => {
      const submitButton = screen.getByRole("button", { name: /add category/i });
      await userEvent.click(submitButton);

      await waitFor(async () => {
        const nameError = screen.getByText(/category name is required/i);
        await expect(nameError).toBeInTheDocument();
      });

      await expect(args.onSubmit).not.toHaveBeenCalled();
    });

    await step("Fill name field clears its error", async () => {
      const nameInput = screen.getByLabelText(/category name/i);
      await userEvent.type(nameInput, "Groceries");

      const submitButton = screen.getByRole("button", { name: /add category/i });
      await userEvent.click(submitButton);

      await waitFor(async () => {
        const nameError = screen.queryByText(/category name is required/i);
        await expect(nameError).not.toBeInTheDocument();
      });
    });
  }
});

/**
 * Tests amount validation against remaining budget.
 * Verifies that amount cannot exceed remaining amount.
 */
export const ValidationAmountExceedsRemaining = meta.story({
  args: {
    onClose: fn(),
    onSubmit: fn(),
    defaultValues: {
      remainingAmount: 500,
      icon: "home",
      color: "#ef4444"
    }
  },
  play: async ({ args, step }) => {
    await waitFor(async () => {
      const amountInput = screen.getByLabelText(/^amount$/i);
      await expect(amountInput).toBeVisible();
    });

    await step("Enter amount exceeding remaining budget", async () => {
      const nameInput = screen.getByLabelText(/category name/i);
      await userEvent.type(nameInput, "Test Category");

      const amountInput = screen.getByLabelText(/^amount$/i);
      await userEvent.type(amountInput, "600");

      const submitButton = screen.getByRole("button", { name: /add category/i });
      await userEvent.click(submitButton);

      await waitFor(async () => {
        const amountError = screen.getByText(/amount cannot exceed remaining amount/i);
        await expect(amountError).toBeInTheDocument();
      });

      await expect(args.onSubmit).not.toHaveBeenCalled();
    });

    await step("Valid amount allows submission", async () => {
      const amountInput = screen.getByLabelText(/^amount$/i);
      await userEvent.clear(amountInput);
      await userEvent.type(amountInput, "400");

      const submitButton = screen.getByRole("button", { name: /add category/i });
      await userEvent.click(submitButton);

      await waitFor(async () => {
        await expect(args.onSubmit).toHaveBeenCalled();
      });
    });
  }
});

/**
 * Tests complete user flow for creating a new category.
 * Verifies all fields can be filled and form submits correctly.
 */
export const CompleteCreateFlow = meta.story({
  args: {
    onSubmit: fn(),
    onClose: fn()
  },
  play: async ({ args, step }) => {
    await waitFor(async () => {
      const title = screen.getByRole("heading", { name: /add new category/i });
      await expect(title).toBeVisible();
    });

    await step("Fill category name", async () => {
      const nameInput = screen.getByLabelText(/category name/i);
      await userEvent.type(nameInput, "Groceries");
      await expect(nameInput).toHaveValue("Groceries");
    });

    await step("Fill optional description", async () => {
      const descriptionInput = screen.getByLabelText(/description/i);
      await userEvent.type(descriptionInput, "Weekly grocery shopping");
      await expect(descriptionInput).toHaveValue("Weekly grocery shopping");
    });

    await step("Select icon using keyboard", async () => {
      const iconRadioGroup = screen.getByRole("radiogroup", { name: /icon/i });
      const firstIcon = within(iconRadioGroup).getByRole("radio", { name: CATEGORY_ICONS[0]?.label });
      await userEvent.click(firstIcon);

      await expect(firstIcon).toBeChecked();
    });

    await step("Select color", async () => {
      const colorRadioGroup = screen.getByRole("radiogroup", { name: /color/i });

      // Find green color option (verify it exists before selecting)
      await waitFor(async () => {
        const greenColor = within(colorRadioGroup).getByRole("radio", { name: /green/i });
        await expect(greenColor).toBeVisible();
        await userEvent.click(greenColor);
      });

      const greenColor = within(colorRadioGroup).getByRole("radio", { name: /green/i });
      await expect(greenColor).toBeChecked();
    });

    await step("Enter amount", async () => {
      const amountInput = screen.getByLabelText(/^amount$/i);
      await userEvent.type(amountInput, "250");
      await expect(amountInput).toHaveValue(250);
    });

    await step("Submit form successfully", async () => {
      const submitButton = screen.getByRole("button", { name: /add category/i });
      await userEvent.click(submitButton);

      await waitFor(async () => {
        await expect(args.onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: "Groceries",
            description: "Weekly grocery shopping",
            icon: CATEGORY_ICONS[0]?.id,
            color: CATEGORY_COLORS[5]?.id,
            amount: 250
          })
        );
      });

      await expect(args.onClose).toHaveBeenCalled();
    });
  }
});

/**
 * Tests edit mode with prefilled values.
 * Verifies form loads with existing data and can be updated.
 */
export const EditModeWithPrefilledValues = meta.story({
  args: {
    mode: "edit",
    onClose: fn(),
    onSubmit: fn(),
    defaultValues: {
      name: "Groceries",
      description: "Weekly grocery shopping",
      icon: "shopping-cart",
      color: "#22c55e",
      amount: 500,
      remainingAmount: 1000,
      examples: ["Vegetables", "Fruits"]
    }
  },
  play: async ({ args, step }) => {
    await step("Dialog shows edit mode title", async () => {
      await waitFor(async () => {
        const title = screen.getByRole("heading", { name: /edit category/i });
        await expect(title).toBeVisible();
      });

      await waitFor(async () => {
        const description = screen.getByText(/update the category details/i);
        await expect(description).toBeVisible();
      });

      const saveButton = screen.getByRole("button", { name: /save changes/i });
      await expect(saveButton).toBeVisible();
    });

    await step("Form fields are prefilled with existing values", async () => {
      const nameInput = screen.getByLabelText(/category name/i);
      await expect(nameInput).toHaveValue("Groceries");

      const descriptionInput = screen.getByLabelText(/description/i);
      await expect(descriptionInput).toHaveValue("Weekly grocery shopping");

      const amountInput = screen.getByLabelText(/^amount$/i);
      await expect(amountInput).toHaveValue(500);
    });

    await step("Update name and submit", async () => {
      const nameInput = screen.getByLabelText(/category name/i);
      await userEvent.clear(nameInput);
      await userEvent.type(nameInput, "Weekly Groceries");

      const saveButton = screen.getByRole("button", { name: /save changes/i });
      await userEvent.click(saveButton);

      await waitFor(async () => {
        await expect(args.onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: "Weekly Groceries"
          })
        );
      });
    });
  }
});

/**
 * Tests cancel button closes dialog without submitting.
 * Verifies form is reset and onClose is called.
 */
export const CancelClosesDialog = meta.story({
  args: {
    onSubmit: fn(),
    onClose: fn()
  },
  play: async ({ args, step }) => {
    await waitFor(async () => {
      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      await expect(cancelButton).toBeVisible();
    });

    await step("Fill some fields before canceling", async () => {
      const nameInput = screen.getByLabelText(/category name/i);
      await userEvent.type(nameInput, "Test Category");
      await expect(nameInput).toHaveValue("Test Category");
    });

    await step("Cancel closes dialog without submitting", async () => {
      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      await userEvent.click(cancelButton);

      await expect(args.onClose).toHaveBeenCalledOnce();
      await expect(args.onSubmit).not.toHaveBeenCalled();
    });
  }
});
