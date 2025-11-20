import { type Meta, type StoryObj } from "@storybook/nextjs-vite";
import { fn, userEvent, within, expect } from "storybook/test";

import { ProductsForm } from "./products-form";

const meta = {
  title: "Features/Onboarding/Products Form",
  component: ProductsForm,
  decorators: [(story) => <div className="w-full max-w-xl">{story()}</div>]
} satisfies Meta<typeof ProductsForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default state with no default values provided.
 * Budget is true and investment is false by default.
 * Button shows "Get Started" and is full width.
 */
export const NoDefaultValues: Story = {
  args: {
    onContinueAction: fn()
  },
  play: async ({ canvas, args }) => {
    // Verify default values are applied
    const budgetCheckbox = canvas.getByRole("checkbox", { name: /monthly budgets/i });
    const investmentCheckbox = canvas.getByRole("checkbox", { name: /investment accounts/i });

    await expect(budgetCheckbox).toBeChecked();
    await expect(investmentCheckbox).not.toBeChecked();

    // Verify button text and styling
    const submitButton = canvas.getByRole("button", { name: /get started/i });
    await expect(submitButton).toBeInTheDocument();
    await expect(submitButton).toHaveClass(/w-full/);

    // Test form submission with default values
    await userEvent.click(submitButton);

    // Verify the action was called with default values
    await expect(args.onContinueAction).toHaveBeenCalledWith({
      budget: true,
      investment: false
    });
  }
};

/**
 * Form with prefilled values.
 * Both checkboxes are checked.
 * Button shows "Continue" and is not full width.
 */
export const PrefilledValues: Story = {
  args: {
    defaultValues: {
      budget: true,
      investment: true
    },
    onContinueAction: fn()
  },
  play: async ({ canvas, args }) => {
    // Verify prefilled values
    const budgetCheckbox = canvas.getByRole("checkbox", { name: /monthly budgets/i });
    const investmentCheckbox = canvas.getByRole("checkbox", { name: /investment accounts/i });

    await expect(budgetCheckbox).toBeChecked();
    await expect(investmentCheckbox).toBeChecked();

    // Verify button text changes when default values are provided
    const submitButton = canvas.getByRole("button", { name: /continue/i });
    await expect(submitButton).toBeInTheDocument();
    await expect(submitButton).not.toHaveClass(/w-full/);

    // Test form submission with prefilled values
    await userEvent.click(submitButton);

    await expect(args.onContinueAction).toHaveBeenCalledWith({
      budget: true,
      investment: true
    });
  }
};

/**
 * Test user interaction - toggling checkboxes.
 * Verifies that user can change form values.
 */
export const UserInteraction: Story = {
  args: {
    onContinueAction: fn()
  },
  play: async ({ canvas, args }) => {
    const budgetCheckbox = canvas.getByRole("checkbox", { name: /monthly budgets/i });
    const investmentCheckbox = canvas.getByRole("checkbox", { name: /investment accounts/i });

    // Initial state: budget checked, investment unchecked
    await expect(budgetCheckbox).toBeChecked();
    await expect(investmentCheckbox).not.toBeChecked();

    // Toggle investment on
    await userEvent.click(investmentCheckbox);
    await expect(investmentCheckbox).toBeChecked();

    // Toggle budget off
    await userEvent.click(budgetCheckbox);
    await expect(budgetCheckbox).not.toBeChecked();

    // Submit form with modified values
    const submitButton = canvas.getByRole("button", { name: /get started/i });
    await userEvent.click(submitButton);

    await expect(args.onContinueAction).toHaveBeenCalledWith({
      budget: false,
      investment: true
    });
  }
};

/**
 * Test form with both options disabled.
 * Edge case where user unchecks everything.
 */
export const BothUnchecked: Story = {
  args: {
    defaultValues: {
      budget: false,
      investment: false
    },
    onContinueAction: fn()
  },
  play: async ({ canvas, args }) => {
    const budgetCheckbox = canvas.getByRole("checkbox", { name: /monthly budgets/i });
    const investmentCheckbox = canvas.getByRole("checkbox", { name: /investment accounts/i });

    await expect(budgetCheckbox).not.toBeChecked();
    await expect(investmentCheckbox).not.toBeChecked();

    const submitButton = canvas.getByRole("button", { name: /continue/i });
    await userEvent.click(submitButton);

    await expect(args.onContinueAction).toHaveBeenCalledWith({
      budget: false,
      investment: false
    });
  }
};

/**
 * Test loading state during form submission.
 * Verifies button shows loading indicator.
 */
export const LoadingState: Story = {
  args: {
    onContinueAction: async () =>
      new Promise((resolve) => {
        setTimeout(() => resolve(null as never), 2000);
      })
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const submitButton = canvas.getByRole("button", { name: /get started/i });
    await userEvent.click(submitButton);

    // Button should be in loading state (disabled during submission)
    await expect(submitButton).toBeDisabled();
    await expect(submitButton).toHaveAttribute("data-state", "loading");
  }
};

/**
 * Integration test: Complete user flow.
 * User starts with defaults, modifies both fields, and submits.
 */
export const CompleteUserFlow: Story = {
  args: {
    onContinueAction: fn()
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Step 1: Verify initial state
    const budgetCheckbox = canvas.getByRole("checkbox", { name: /monthly budgets/i });
    const investmentCheckbox = canvas.getByRole("checkbox", { name: /investment accounts/i });

    await expect(budgetCheckbox).toBeChecked();
    await expect(investmentCheckbox).not.toBeChecked();

    // Step 2: Verify form labels and descriptions
    await expect(canvas.getByText("What do you want to configure?")).toBeInTheDocument();
    await expect(canvas.getByText("Monthly budgets")).toBeInTheDocument();
    await expect(canvas.getByText("Recommended for all users")).toBeInTheDocument();
    await expect(canvas.getByText("Investment accounts")).toBeInTheDocument();
    await expect(canvas.getByText("Optional - you can add later")).toBeInTheDocument();

    // Step 3: Enable investment
    await userEvent.click(investmentCheckbox);
    await expect(investmentCheckbox).toBeChecked();

    // Step 4: Keep budget enabled and submit
    const submitButton = canvas.getByRole("button", { name: /get started/i });
    await userEvent.click(submitButton);

    // Step 5: Verify submission
    await expect(args.onContinueAction).toHaveBeenCalledWith({
      budget: true,
      investment: true
    });
  }
};
