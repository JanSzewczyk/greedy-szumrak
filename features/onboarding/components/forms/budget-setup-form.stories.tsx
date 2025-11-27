import { type Meta, type StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { createTestBudgetTemplate } from "~/features/budget/test/builders";
import { BudgetSetupForm } from "~/features/onboarding/components/forms/budget-setup-form";
import { onboardingBudgetBuilder, onboardingPreferencesBuilder } from "~/features/onboarding/test/builders";
import { type RedirectAction } from "~/lib/action-types";

const meta = {
  title: "Features/Onboarding/Budget Setup Form",
  component: BudgetSetupForm,
  decorators: [(story) => <div className="w-full max-w-xl">{story()}</div>],
  args: {
    onContinueAction: fn(
      () =>
        ({
          success: true
        }) as unknown as RedirectAction
    ),
    onBackAction: fn(),
    budgetTemplates: createTestBudgetTemplate.allPredefined(),
    preferences: onboardingPreferencesBuilder.one()
  }
} satisfies Meta<typeof BudgetSetupForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Initial state of the form with no data filled in.
 * Shows the monthly income input and no budget template options yet.
 */
export const InitialForm: Story = {
  play: async ({ canvas, step }) => {
    await step("Verify text content", async () => {
      await expect(canvas.getByRole("group", { name: /set up budgets/i })).toBeVisible();
      await expect(canvas.getByText(/set up budgets/i)).toBeVisible();
      await expect(canvas.getByText(/choose a template or start from scratch/i)).toBeVisible();
    });

    await step("Verify monthly income input is visible", async () => {
      const monthlyIncomeInput = canvas.getByLabelText(/what is your monthly net income/i);
      await expect(monthlyIncomeInput).toBeVisible();
    });

    await step("Verify budget templates are NOT visible initially (until income is entered)", async () => {
      const budgetTemplateLabel = canvas.queryByText(/choose a budget template/i);
      await expect(budgetTemplateLabel).toBeNull();
    });

    await step("Verify action buttons are present", async () => {
      const backButton = canvas.getByRole("button", { name: /back/i });
      const continueButton = canvas.getByRole("button", { name: /continue/i });
      await expect(backButton).toBeVisible();
      await expect(continueButton).toBeVisible();
    });
  }
};

/**
 * Form prefilled with default values showing both income and selected template.
 */
export const Prefilled: Story = {
  args: {
    defaultValues: onboardingBudgetBuilder.one()
  },
  play: async ({ canvas, args, step }) => {
    await step("Verify monthly income is prefilled", async () => {
      const monthlyIncomeInput = canvas.getByLabelText(/what is your monthly net income/i);
      await expect(monthlyIncomeInput).toHaveValue(args.defaultValues?.monthlyIncome);
    });

    await step("Verify budget templates are visible", async () => {
      await waitFor(async () => {
        const budgetTemplateLabel = canvas.getByText(/choose a budget template/i);
        await expect(budgetTemplateLabel).toBeVisible();
      });
    });

    await step("Verify the selected template is checked", async () => {
      const selectedBudgetProfile = args.budgetTemplates?.find(({ id }) => id === args.defaultValues?.budgetProfile);
      const selectedRadio = canvas.getByRole("radio", {
        name: new RegExp(selectedBudgetProfile?.name ?? "", "i")
      });
      await expect(selectedRadio).toBeChecked();
    });

    await step("Verify allocation amounts are displayed", async () => {
      const allocationLabels = canvas.getAllByText(/needs|wants|savings/i);
      await expect(allocationLabels.length).toBeGreaterThan(0);
    });

    await step("Submit form successfully", async () => {
      const continueButton = canvas.getByRole("button", { name: /continue/i });
      await userEvent.click(continueButton);

      await expect(args.onContinueAction).toHaveBeenCalledOnce();
    });
  }
};

/**
 * Tests validation errors when submitting without required fields.
 */
export const ErrorValidation: Story = {
  play: async ({ canvas, args, step }) => {
    await step("Try to submit without filling anything", async () => {
      const continueButton = canvas.getByRole("button", { name: /continue/i });
      await userEvent.click(continueButton);
    });

    const monthlyIncomeTextField = canvas.getByLabelText("What is your monthly net income?");

    await step("Verify validation error appears for monthly income", async () => {
      await expect(monthlyIncomeTextField).toBeInvalid();
      const errorMessage = canvas.getByRole("alert");
      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).toHaveTextContent(/please enter a valid monthly income greater than 0/i);
    });

    await step("Verify onContinueAction was NOT called due to validation error", async () => {
      await expect(args.onContinueAction).not.toHaveBeenCalled();
    });

    await step("Fill in income with invalid value (0)", async () => {
      await userEvent.clear(monthlyIncomeTextField);
      await userEvent.type(monthlyIncomeTextField, "0");
      await userEvent.tab();

      const errorMessage = canvas.getByRole("alert");
      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).toHaveTextContent(/please enter a valid monthly income greater than 0/i);
    });

    await step("Try to submit again with invalid value", async () => {
      const continueButton = canvas.getByRole("button", { name: /continue/i });
      await userEvent.click(continueButton);
    });

    await step("Verify budget templates are still not visible with invalid income", async () => {
      const budgetTemplateLabel = canvas.queryByText(/choose a budget template/i);
      await expect(budgetTemplateLabel).not.toBeInTheDocument();
    });

    await step("Enter monthly income (8000)", async () => {
      await userEvent.clear(monthlyIncomeTextField);
      await userEvent.type(monthlyIncomeTextField, "8000");
      await userEvent.tab();
    });

    await step("Verify budget templates appear after blur", async () => {
      await waitFor(async () => {
        const budgetTemplateLabel = canvas.getByText(/choose a budget template/i);
        await expect(budgetTemplateLabel).toBeVisible();
      });
    });

    await step("Try to submit without selecting a budget template", async () => {
      const continueButton = canvas.getByRole("button", { name: /continue/i });
      await userEvent.click(continueButton);
      await expect(args.onContinueAction).not.toHaveBeenCalled();
    });

    await step("Verify validation error appears for budget template selection", async () => {
      const errorMessage = canvas.getByRole("alert");
      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).toHaveTextContent(/please select a budget profile/i);
    });

    await step("Verify onContinueAction was NOT called due to missing budget template", async () => {
      await expect(args.onContinueAction).not.toHaveBeenCalled();
    });
  }
};

/**
 * Tests the interaction flow:
 * 1. Enter monthly income value
 * 2. Verify radio buttons appear on blur event
 * 3. Verify allocation values update based on income
 * 4. Select a budget template and submit
 */
export const Interaction: Story = {
  play: async ({ canvas, args, step }) => {
    await step("Enter monthly income (10000)", async () => {
      const monthlyIncomeInput = canvas.getByLabelText(/what is your monthly net income/i);
      await userEvent.clear(monthlyIncomeInput);
      await userEvent.type(monthlyIncomeInput, "10000");
    });

    await step("Verify templates are NOT visible yet (before blur)", async () => {
      const budgetTemplateLabel = canvas.queryByText(/choose a budget template/i);
      await expect(budgetTemplateLabel).not.toBeInTheDocument();
    });

    await step("Trigger blur event to show radio buttons", async () => {
      await userEvent.tab();
    });

    await step("Verify budget templates appear after blur", async () => {
      await waitFor(async () => {
        const budgetTemplateLabel = canvas.getByText(/choose a budget template/i);
        await expect(budgetTemplateLabel).toBeVisible();
      });
    });

    await step("Verify allocation values for 10000 PLN (50/30/20)", async () => {
      await waitFor(async () => {
        // Match numbers with comma or space thousand separator: "5,000" or "5 000"
        // Use getAllByText since these values appear for each budget template
        const needsAllocations = canvas.getAllByText(/5[,\s]000/);
        const wantsAllocations = canvas.getAllByText(/3[,\s]000/);
        const savingsAllocations = canvas.getAllByText(/2[,\s]000/);

        // Verify at least one of each allocation type is visible
        await expect(needsAllocations.length).toBeGreaterThan(0);
        await expect(wantsAllocations.length).toBeGreaterThan(0);
        await expect(savingsAllocations.length).toBeGreaterThan(0);
      });
    });

    await step("Change income to 8000 and trigger blur", async () => {
      const monthlyIncomeInput = canvas.getByLabelText(/what is your monthly net income/i);
      await userEvent.clear(monthlyIncomeInput);
      await userEvent.type(monthlyIncomeInput, "8000");
      await userEvent.tab();
    });

    await step("Verify updated allocations for 8000 PLN (50/30/20)", async () => {
      await waitFor(async () => {
        // Match numbers with comma or space thousand separator
        // Use getAllByText since these values appear for each budget template
        const needsAllocations = canvas.getAllByText(/4[,\s]000/);
        const wantsAllocations = canvas.getAllByText(/2[,\s]400/);
        const savingsAllocations = canvas.getAllByText(/1[,\s]600/);

        // Verify at least one of each allocation type is visible
        await expect(needsAllocations.length).toBeGreaterThan(0);
        await expect(wantsAllocations.length).toBeGreaterThan(0);
        await expect(savingsAllocations.length).toBeGreaterThan(0);
      });
    });

    await step("Select Young Professional template", async () => {
      const youngProfessionalRadio = canvas.getByRole("radio", { name: /young professional/i });
      await userEvent.click(youngProfessionalRadio);
      await expect(youngProfessionalRadio).toBeChecked();
    });

    await step("Submit the form", async () => {
      const continueButton = canvas.getByRole("button", { name: /continue/i });
      await userEvent.click(continueButton);
    });

    await step("Verify onContinueAction was called with correct data", async () => {
      await waitFor(async () => {
        await expect(args.onContinueAction).toHaveBeenCalledWith({
          monthlyIncome: 8000,
          budgetProfile: "young_professional"
        });
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
 * Tests selecting custom template option.
 */
export const SelectCustomTemplate: Story = {
  // Enable in feature
  // play: async ({ canvas, args, step }) => {
  //   await step("Enter income (6000)", async () => {
  //     const monthlyIncomeInput = canvas.getByLabelText(/what is your monthly net income/i);
  //     await userEvent.type(monthlyIncomeInput, "6000");
  //     await userEvent.tab();
  //   });
  //
  //   await step("Wait for templates to appear", async () => {
  //     await waitFor(async () => {
  //       const budgetTemplateLabel = canvas.getByText(/choose a budget template/i);
  //       await expect(budgetTemplateLabel).toBeInTheDocument();
  //     });
  //   });
  //
  //   await step("Select custom template", async () => {
  //     const customRadio = canvas.getByRole("radio", { name: /custom template/i });
  //     await userEvent.click(customRadio);
  //     await expect(customRadio).toBeChecked();
  //   });
  //
  //   await step("Submit form", async () => {
  //     const continueButton = canvas.getByRole("button", { name: /continue/i });
  //     await userEvent.click(continueButton);
  //   });
  //
  //   await step("Verify submission with custom profile", async () => {
  //     await waitFor(async () => {
  //       await expect(args.onContinueAction).toHaveBeenCalledWith({
  //         monthlyIncome: 6000,
  //         budgetProfile: "custom"
  //       });
  //     });
  //   });
  // }
};

/**
 * Tests that Recommended badge is shown on the appropriate template.
 */
export const RecommendedBadge: Story = {
  args: {
    defaultValues: {
      monthlyIncome: 7000,
      budgetProfile: "young_professional"
    }
  },
  play: async ({ canvas, step }) => {
    await step("Wait for templates to be visible", async () => {
      await waitFor(async () => {
        const budgetTemplateLabel = canvas.getByText(/choose a budget template/i);
        await expect(budgetTemplateLabel).toBeInTheDocument();
      });
    });

    await step("Verify Recommended badge is present", async () => {
      const recommendedBadge = canvas.getByText(/recommended/i);
      await expect(recommendedBadge).toBeInTheDocument();
    });
  }
};
