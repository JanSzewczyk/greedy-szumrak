import { type Meta, type StoryObj } from "@storybook/react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";

import { BudgetCategoryFormDialog } from "./budget-category-form-dialog";

const meta = {
  title: "Features/Onboarding/BudgetCategoryFormDialog",
  component: BudgetCategoryFormDialog,
  decorators: [(story) => <div className="w-full max-w-xl">{story()}</div>],
  args: {
    isOpen: true,
    onClose: fn(),
    onSubmit: fn(),
    mode: "create"
  }
} satisfies Meta<typeof BudgetCategoryFormDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Initial state of the dialog in create mode.
 * Shows empty form fields ready for user input.
 */
export const CreateMode: Story = {
  args: {
    mode: "create",
    defaultValues: {
      remainingAmount: 1000
    }
  },
  play: async ({ canvasElement }) => {
    const portal = within(canvasElement.parentElement as HTMLElement);

    await waitFor(async () => {
      const title = portal.getByRole("heading", { name: /add new category/i });
      await expect(title).toBeVisible();
    });

    const description = portal.getByText(/create a new budget category/i);
    await expect(description).toBeVisible();

    const addButton = portal.getByRole("button", { name: /add category/i });
    await expect(addButton).toBeVisible();
  }
};

/**
 * Dialog in edit mode with prefilled values.
 * Shows form populated with existing category data.
 */
export const EditMode: Story = {
  args: {
    mode: "edit",
    defaultValues: {
      name: "Groceries",
      description: "Weekly grocery shopping",
      icon: "shopping-cart",
      color: "#22c55e",
      amount: 500,
      remainingAmount: 1000,
      examples: ["Vegetables", "Fruits", "Dairy"]
    }
  },
  play: async ({ canvasElement }) => {
    const portal = within(canvasElement.parentElement as HTMLElement);

    await waitFor(async () => {
      const title = portal.getByRole("heading", { name: /edit category/i });
      await expect(title).toBeVisible();
    });

    const description = portal.getByText(/update the category details/i);
    await expect(description).toBeVisible();

    const saveButton = portal.getByRole("button", { name: /save changes/i });
    await expect(saveButton).toBeVisible();

    const nameInput = portal.getByLabelText(/category name/i);
    await expect(nameInput).toHaveValue("Groceries");
  }
};

/**
 * Tests form validation when submitting empty form.
 * Verifies that validation errors are shown.
 */
export const ValidationEmptyForm: Story = {
  args: {
    mode: "create",
    onSubmit: fn(),
    defaultValues: {
      remainingAmount: 1000
    }
  },
  play: async ({ canvasElement, args }) => {
    const portal = within(canvasElement.parentElement as HTMLElement);

    await waitFor(async () => {
      const addButton = portal.getByRole("button", { name: /add category/i });
      await expect(addButton).toBeVisible();
    });

    const addButton = portal.getByRole("button", { name: /add category/i });
    await userEvent.click(addButton);

    await waitFor(async () => {
      const errorMessage = portal.getByText(/category name is required/i);
      await expect(errorMessage).toBeInTheDocument();
    });

    await expect(args.onSubmit).not.toHaveBeenCalled();
  }
};

/**
 * Tests form fields are visible and interactive.
 */
export const FormFieldsInteraction: Story = {
  args: {
    mode: "create",
    defaultValues: {
      remainingAmount: 1000
    }
  },
  play: async ({ canvasElement }) => {
    const portal = within(canvasElement.parentElement as HTMLElement);

    await waitFor(async () => {
      const nameInput = portal.getByLabelText(/category name/i);
      await expect(nameInput).toBeVisible();
    });

    // Fill name field
    const nameInput = portal.getByLabelText(/category name/i);
    await userEvent.type(nameInput, "Groceries");
    await expect(nameInput).toHaveValue("Groceries");

    // Fill description
    const descriptionInput = portal.getByLabelText(/description/i);
    await userEvent.type(descriptionInput, "Weekly shopping");
    await expect(descriptionInput).toHaveValue("Weekly shopping");

    // Fill amount
    const amountInput = portal.getByLabelText(/^amount$/i);
    await userEvent.type(amountInput, "500");
    await expect(amountInput).toHaveValue(500);
  }
};

/**
 * Tests cancel button closes dialog without submitting.
 */
export const CancelAction: Story = {
  args: {
    onSubmit: fn(),
    onClose: fn(),
    defaultValues: {
      remainingAmount: 1000
    }
  },
  play: async ({ canvasElement, args }) => {
    const portal = within(canvasElement.parentElement as HTMLElement);

    await waitFor(async () => {
      const cancelButton = portal.getByRole("button", { name: /cancel/i });
      await expect(cancelButton).toBeVisible();
    });

    const cancelButton = portal.getByRole("button", { name: /cancel/i });
    await userEvent.click(cancelButton);

    await expect(args.onClose).toHaveBeenCalledOnce();
    await expect(args.onSubmit).not.toHaveBeenCalled();
  }
};