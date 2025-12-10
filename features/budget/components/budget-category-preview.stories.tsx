import { type Meta, type StoryObj } from "@storybook/react";
import { expect } from "storybook/test";

import { BudgetCategoryPreview } from "./budget-category-preview";

const meta = {
  title: "Features/Budget/Budget Category Preview",
  component: BudgetCategoryPreview,
  decorators: [(story) => <div className="w-full max-w-xl">{story()}</div>]
} satisfies Meta<typeof BudgetCategoryPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Complete category with all fields populated.
 * Shows icon, name, description, and amount.
 */
export const Complete: Story = {
  args: {
    category: {
      name: "Groceries",
      description: "Weekly grocery shopping expenses",
      icon: "shopping-cart",
      color: "#22c55e",
      amount: 500,
      remainingAmount: 1000,
      examples: ["Vegetables", "Fruits"]
    }
  },
  play: async ({ canvas }) => {
    const title = canvas.getByText("Groceries");
    await expect(title).toBeVisible();

    const description = canvas.getByText(/weekly grocery shopping/i);
    await expect(description).toBeVisible();

    const amountInput = canvas.getByLabelText(/preview amount for groceries/i);
    await expect(amountInput).toHaveValue("500");

    const removeButton = canvas.getByRole("button", { name: /preview remove groceries/i });
    await expect(removeButton).toBeVisible();
  }
};

/**
 * Category without description.
 * Shows only icon, name, and amount.
 */
export const WithoutDescription: Story = {
  args: {
    category: {
      name: "Entertainment",
      description: null,
      icon: "film",
      color: "#8b5cf6",
      amount: 200,
      remainingAmount: 1000,
      examples: []
    }
  },
  play: async ({ canvas }) => {
    const title = canvas.getByText("Entertainment");
    await expect(title).toBeVisible();

    const amountInput = canvas.getByLabelText(/preview amount for entertainment/i);
    await expect(amountInput).toHaveValue("200");

    const removeButton = canvas.getByRole("button", { name: /preview remove entertainment/i });
    await expect(removeButton).toBeVisible();
  }
};

/**
 * Category with zero amount.
 * Shows empty placeholder in amount field.
 */
export const ZeroAmount: Story = {
  args: {
    category: {
      name: "Savings",
      description: "Emergency fund contributions",
      icon: "piggy-bank",
      color: "#0ea5e9",
      amount: 0,
      remainingAmount: 1000,
      examples: []
    }
  },
  play: async ({ canvas }) => {
    const title = canvas.getByText("Savings");
    await expect(title).toBeVisible();

    const amountInput = canvas.getByLabelText(/preview amount for savings/i);
    await expect(amountInput).toHaveValue("");

    const removeButton = canvas.getByRole("button", { name: /preview remove savings/i });
    await expect(removeButton).toBeVisible();
  }
};
