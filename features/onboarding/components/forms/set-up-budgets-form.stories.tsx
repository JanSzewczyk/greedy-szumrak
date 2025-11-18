import { type Meta, type StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { createTestBudgetTemplate } from "~/features/budget/test/builders";
import { SetUpBudgetsForm } from "~/features/onboarding/components/forms/set-up-budgets-form";

const meta = {
  title: "Features/Onboarding/Set Up Budgets Form",
  component: SetUpBudgetsForm,
  decorators: [(story) => <div className="w-full max-w-xl">{story()}</div>],
  args: {
    onContinueAction: fn(),
    onBackAction: fn(),
    budgetTemplates: createTestBudgetTemplate.allPredefined()
  }
} satisfies Meta<typeof SetUpBudgetsForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InitialForm: Story = {};

export const Prefilled: Story = {};

export const ErrorValidation: Story = {};

// test spradza działanie sposobu zmiany wartości monthlyIncome pokazywania radiobuttonów oraz jak zmieniajaą się wartości w radoiobuttonach na on blur event
export const Interaction: Story = {};
