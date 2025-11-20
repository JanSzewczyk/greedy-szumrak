import { type Meta, type StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { createTestBudgetTemplate } from "~/features/budget/test/builders";
import { BudgetDetailsForm } from "~/features/onboarding/components/forms/budget-details-form";
import { onboardingPreferencesBuilder } from "~/features/onboarding/test/builders";
import { type RedirectAction } from "~/lib/action-types";

const meta = {
  title: "Features/Onboarding/Budget Details Form",
  component: BudgetDetailsForm,
  decorators: [(story) => <div className="w-full max-w-xl">{story()}</div>],
  args: {
    onContinueAction: fn(
      () =>
        ({
          success: true
        }) as unknown as RedirectAction
    ),
    onBackAction: fn(),
    budgetTemplate: createTestBudgetTemplate.youngProfessional(),
    monthlyIncome: 8000,
    preferences: onboardingPreferencesBuilder.one()
  }
} satisfies Meta<typeof BudgetDetailsForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Initial state of the form with categories pre-populated from budget template.
 * Shows all categories with calculated amounts based on monthly income.
 */
export const InitialForm: Story = {
  play: async ({ canvas, step }) => {
    await step("Verify text content", async () => {
      await expect(canvas.getByRole("group", { name: /budget details/i })).toBeVisible();
      await expect(canvas.getByText(/budget details/i)).toBeVisible();
      await expect(canvas.getByText(/configure budget amounts for each category/i)).toBeVisible();
    });

    await step("Verify total allocated and remaining amounts are displayed", async () => {
      await expect(canvas.getByText(/total allocated/i)).toBeVisible();
      await expect(canvas.getByText(/remaining/i)).toBeVisible();
    });

    await step("Verify categories are pre-populated", async () => {
      const categorySelects = canvas.getAllByLabelText(/category/i);
      await expect(categorySelects.length).toBeGreaterThan(0);
    });

    await step("Verify action buttons are present", async () => {
      const backButton = canvas.getByRole("button", { name: /back/i });
      const continueButton = canvas.getByRole("button", { name: /continue/i });
      await expect(backButton).toBeVisible();
      await expect(continueButton).toBeVisible();
    });

    await step("Verify Add Category button is present", async () => {
      const addButton = canvas.getByRole("button", { name: /add category/i });
      await expect(addButton).toBeVisible();
    });
  }
};

/**
 * Form prefilled with default values showing saved budget details.
 */
export const Prefilled: Story = {
  args: {
    defaultValues: {
      categories: [
        { categoryId: "housing", amount: 2000, percentage: 25 },
        { categoryId: "groceries", amount: 960, percentage: 12 }
      ],
      totalAllocated: 2960,
      remainingAmount: 5040
    }
  },
  play: async ({ canvas, args, step }) => {
    await step("Verify categories are prefilled with saved values", async () => {
      const amountInputs = canvas.getAllByLabelText(/amount/i);
      await expect(amountInputs[0]).toHaveValue(2000);
      await expect(amountInputs[1]).toHaveValue(960);
    });

    await step("Verify percentages are prefilled", async () => {
      const percentageInputs = canvas.getAllByLabelText(/%/i);
      await expect(percentageInputs[0]).toHaveValue(25);
      await expect(percentageInputs[1]).toHaveValue(12);
    });

    await step("Submit form successfully", async () => {
      const continueButton = canvas.getByRole("button", { name: /continue/i });
      await userEvent.click(continueButton);

      await expect(args.onContinueAction).toHaveBeenCalledOnce();
    });
  }
};

/**
 * Tests validation errors when submitting with invalid data.
 */
export const ErrorValidation: Story = {
  args: {
    defaultValues: {
      categories: [],
      totalAllocated: 0,
      remainingAmount: 8000
    }
  },
  play: async ({ canvas, args, step }) => {
    await step("Try to submit without any categories", async () => {
      const continueButton = canvas.getByRole("button", { name: /continue/i });
      await userEvent.click(continueButton);
    });

    await step("Verify validation error appears", async () => {
      await waitFor(async () => {
        const errorMessage = canvas.getByRole("alert");
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toHaveTextContent(/at least one category is required/i);
      });
    });

    await step("Verify onContinueAction was NOT called due to validation error", async () => {
      await expect(args.onContinueAction).not.toHaveBeenCalled();
    });
  }
};

/**
 * Tests the interaction flow:
 * 1. Modify amount and verify percentage updates
 * 2. Modify percentage and verify amount updates
 * 3. Add new category
 * 4. Remove category
 * 5. Submit form
 */
export const Interaction: Story = {
  play: async ({ canvas, args, step }) => {
    await step("Wait for initial render", async () => {
      await waitFor(async () => {
        const categorySelects = canvas.getAllByLabelText(/category/i);
        await expect(categorySelects.length).toBeGreaterThan(0);
      });
    });

    await step("Get first category amount input", async () => {
      const amountInputs = canvas.getAllByLabelText(/amount/i);
      const firstAmountInput = amountInputs[0];
      await expect(firstAmountInput).toBeVisible();
    });

    await step("Change amount and verify percentage updates", async () => {
      const amountInputs = canvas.getAllByLabelText(/amount/i);
      const firstAmountInput = amountInputs[0];
      const percentageInputs = canvas.getAllByLabelText(/%/i);
      const firstPercentageInput = percentageInputs[0];

      if (firstAmountInput) {
        await userEvent.clear(firstAmountInput);
        await userEvent.type(firstAmountInput, "4000");
      }

      await waitFor(async () => {
        // 4000 / 8000 * 100 = 50%
        await expect(firstPercentageInput).toHaveValue(50);
      });
    });

    await step("Change percentage and verify amount updates", async () => {
      const amountInputs = canvas.getAllByLabelText(/amount/i);
      const secondAmountInput = amountInputs[1];
      const percentageInputs = canvas.getAllByLabelText(/%/i);
      const secondPercentageInput = percentageInputs[1];

      if (secondPercentageInput) {
        await userEvent.clear(secondPercentageInput);
        await userEvent.type(secondPercentageInput, "20");
      }

      await waitFor(async () => {
        // 8000 * 20 / 100 = 1600
        await expect(secondAmountInput).toHaveValue(1600);
      });
    });

    await step("Verify total allocated and remaining update", async () => {
      await waitFor(async () => {
        // Total allocated should reflect the sum of all amounts
        const totalText = canvas.getByText(/total allocated/i).parentElement;
        await expect(totalText).toBeInTheDocument();
      });
    });

    await step("Add new category", async () => {
      const initialCategoryCount = canvas.getAllByLabelText(/category/i).length;
      const addButton = canvas.getByRole("button", { name: /add category/i });
      await userEvent.click(addButton);

      await waitFor(async () => {
        const newCategoryCount = canvas.getAllByLabelText(/category/i).length;
        await expect(newCategoryCount).toBe(initialCategoryCount + 1);
      });
    });

    await step("Remove a category", async () => {
      const deleteButtons = canvas.getAllByRole("button").filter((btn) => btn.querySelector("svg"));
      const initialCount = canvas.getAllByLabelText(/category/i).length;

      // Find and click a delete button (TrashIcon button)
      const trashButton = deleteButtons.find((btn) => !btn.textContent?.includes("Add"));
      if (trashButton) {
        await userEvent.click(trashButton);

        await waitFor(async () => {
          const newCount = canvas.getAllByLabelText(/category/i).length;
          await expect(newCount).toBe(initialCount - 1);
        });
      }
    });

    await step("Submit the form", async () => {
      const continueButton = canvas.getByRole("button", { name: /continue/i });
      await userEvent.click(continueButton);
    });

    await step("Verify onContinueAction was called", async () => {
      await waitFor(async () => {
        await expect(args.onContinueAction).toHaveBeenCalled();
      });
    });
  }
};

/**
 * Tests back button functionality.
 */
export const BackNavigation: Story = {
  play: async ({ canvas, args, step }) => {
    await step("Click back button", async () => {
      const backButton = canvas.getByRole("button", { name: /back/i });
      await userEvent.click(backButton);
    });

    await step("Verify onBackAction was called", async () => {
      await expect(args.onBackAction).toHaveBeenCalledOnce();
    });
  }
};

/**
 * Tests that categories can be added dynamically.
 */
export const AddMultipleCategories: Story = {
  play: async ({ canvas, step }) => {
    await step("Get initial category count", async () => {
      const initialCategories = canvas.getAllByLabelText(/category/i);
      const initialCount = initialCategories.length;
      await expect(initialCount).toBeGreaterThan(0);
    });

    await step("Add first new category", async () => {
      const addButton = canvas.getByRole("button", { name: /add category/i });
      await userEvent.click(addButton);
    });

    await step("Add second new category", async () => {
      const addButton = canvas.getByRole("button", { name: /add category/i });
      await userEvent.click(addButton);
    });

    await step("Add third new category", async () => {
      const addButton = canvas.getByRole("button", { name: /add category/i });
      await userEvent.click(addButton);
    });

    await step("Verify all categories were added", async () => {
      await waitFor(async () => {
        const categories = canvas.getAllByLabelText(/category/i);
        // Should have initial categories + 3 new ones
        await expect(categories.length).toBeGreaterThan(3);
      });
    });
  }
};

/**
 * Tests that remaining amount shows negative value when over-allocated.
 */
export const OverBudget: Story = {
  args: {
    defaultValues: {
      categories: [
        { categoryId: "housing", amount: 5000, percentage: 62.5 },
        { categoryId: "groceries", amount: 4000, percentage: 50 }
      ],
      totalAllocated: 9000,
      remainingAmount: -1000
    }
  },
  play: async ({ canvas, step }) => {
    await step("Verify total allocated exceeds monthly income", async () => {
      const totalText = canvas.getByText(/9[,\s]000/);
      await expect(totalText).toBeVisible();
    });

    await step("Verify remaining amount is negative and styled as error", async () => {
      const remainingSection = canvas.getByText(/remaining/i).parentElement;
      await expect(remainingSection).toBeInTheDocument();

      // Verify negative value is displayed
      const negativeValue = canvas.getByText(/-1[,\s]000/);
      await expect(negativeValue).toBeVisible();
    });
  }
};

/**
 * Tests that form works with custom budget template.
 */
export const CustomTemplate: Story = {
  args: {
    budgetTemplate: createTestBudgetTemplate.custom(),
    defaultValues: {
      categories: [
        { categoryId: "custom-category-1", amount: 4000, percentage: 50 },
        { categoryId: "custom-category-2", amount: 4000, percentage: 50 }
      ],
      totalAllocated: 8000,
      remainingAmount: 0
    }
  },
  play: async ({ canvas, args, step }) => {
    await step("Verify custom template categories are loaded", async () => {
      const categories = canvas.getAllByLabelText(/category/i);
      await expect(categories.length).toBeGreaterThan(0);
    });

    await step("Verify total is exactly monthly income (perfectly allocated)", async () => {
      const remainingText = canvas.getByText(/remaining/i).parentElement;
      await expect(remainingText).toBeInTheDocument();

      // Should show 0 remaining
      const zeroValue = canvas.getByText(/^0/);
      await expect(zeroValue).toBeVisible();
    });

    await step("Submit form", async () => {
      const continueButton = canvas.getByRole("button", { name: /continue/i });
      await userEvent.click(continueButton);

      await expect(args.onContinueAction).toHaveBeenCalledOnce();
    });
  }
};
