import { type Meta, type StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { createTestBudgetTemplate } from "~/features/budget/test/builders";
import { BudgetDetailsForm } from "~/features/onboarding/components/forms/budget-details-form/budget-details-form";
import { onboardingBudgetDetailsBuilder, onboardingPreferencesBuilder } from "~/features/onboarding/test/builders";
import { type RedirectAction } from "~/lib/action-types";

const meta = {
  title: "Features/Onboarding/Budget Details Form",
  component: BudgetDetailsForm,
  decorators: [(story) => <div className="w-full max-w-2xl">{story()}</div>],
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
 * Shows all categories grouped by allocation type (needs, wants, savings) with calculated amounts based on monthly income.
 */
export const InitialForm: Story = {
  play: async ({ canvas, step }) => {
    await step("Verify form header and description are visible", async () => {
      await expect(canvas.getByRole("group", { name: /budget details/i })).toBeVisible();
      await expect(canvas.getByText(/budget details/i)).toBeVisible();
      await expect(canvas.getByText(/configure budget amounts for each category/i)).toBeVisible();
    });

    await step("Verify summary section shows total and remaining amounts", async () => {
      await expect(canvas.getByText(/total monthly budget/i)).toBeVisible();
      // There are multiple "Allocated:" texts - one in summary and one per allocation section
      const allocatedTexts = canvas.getAllByText(/allocated:/i);
      await expect(allocatedTexts.length).toBeGreaterThan(0);
      const remainingTexts = canvas.getAllByText(/remaining:/i);
      await expect(remainingTexts.length).toBeGreaterThan(0);
    });

    await step("Verify progress bar is displayed", async () => {
      const progressBar = canvas.getByRole("progressbar");
      await expect(progressBar).toBeVisible();
    });

    await step("Verify allocation sections are present (needs, wants, savings)", async () => {
      // Each allocation type may appear in multiple places (header and categories)
      // Check that at least one of each exists
      const needsElements = canvas.getAllByText(/needs/i);
      await expect(needsElements.length).toBeGreaterThan(0);
      const wantsElements = canvas.getAllByText(/wants/i);
      await expect(wantsElements.length).toBeGreaterThan(0);
      const savingsElements = canvas.getAllByText(/savings/i);
      await expect(savingsElements.length).toBeGreaterThan(0);
    });

    await step("Verify action buttons are present and enabled", async () => {
      const backButton = canvas.getByRole("button", { name: /back/i });
      const continueButton = canvas.getByRole("button", { name: /continue/i });
      await expect(backButton).toBeVisible();
      await expect(backButton).toBeEnabled();
      await expect(continueButton).toBeVisible();
      await expect(continueButton).toBeEnabled();
    });

    await step("Verify Add Category buttons are present in each allocation section", async () => {
      const addButtons = canvas.getAllByRole("button", { name: /add category/i });
      await expect(addButtons.length).toBeGreaterThanOrEqual(1);
    });

    await step("Verify category amount inputs are present", async () => {
      const amountInputs = canvas.getAllByRole("spinbutton");
      await expect(amountInputs.length).toBeGreaterThan(0);
    });
  }
};

/**
 * Form prefilled with default values showing saved budget details.
 * Uses the onboardingBudgetDetailsBuilder to generate consistent test data.
 */
export const Prefilled: Story = {
  args: {
    defaultValues: onboardingBudgetDetailsBuilder.one()
  },
  play: async ({ canvas, args, step }) => {
    await step("Verify allocation sections are displayed", async () => {
      const needsElements = canvas.getAllByText(/needs/i);
      await expect(needsElements.length).toBeGreaterThan(0);
      const wantsElements = canvas.getAllByText(/wants/i);
      await expect(wantsElements.length).toBeGreaterThan(0);
      const savingsElements = canvas.getAllByText(/savings/i);
      await expect(savingsElements.length).toBeGreaterThan(0);
    });

    await step("Verify amounts are prefilled based on template percentages", async () => {
      const amountInputs = canvas.getAllByRole("spinbutton");
      await expect(amountInputs.length).toBeGreaterThan(0);

      // Verify at least one input has a non-zero value
      const hasNonZeroValue = amountInputs.some((input) => {
        const value = Number((input as HTMLInputElement).value);
        return value > 0;
      });
      await expect(hasNonZeroValue).toBe(true);
    });

    await step("Submit form successfully", async () => {
      const continueButton = canvas.getByRole("button", { name: /continue/i });
      await userEvent.click(continueButton);

      await waitFor(async () => {
        await expect(args.onContinueAction).toHaveBeenCalledOnce();
      });
    });
  }
};

// /**
//  * Form prefilled using the budget details builder with young professional trait.
//  */
// export const PrefilledWithBuilder: Story = {
//   args: {
//     defaultValues: createTestBudgetDetails.withIncome(8000)
//   },
//   play: async ({ canvas, args, step }) => {
//     await step("Verify form is populated with builder data", async () => {
//       const amountInputs = canvas.getAllByRole("spinbutton");
//       await expect(amountInputs.length).toBeGreaterThan(0);
//     });
//
//     await step("Verify allocation labels are correct", async () => {
//       const needsElements = canvas.getAllByText(/needs/i);
//       await expect(needsElements.length).toBeGreaterThan(0);
//       const wantsElements = canvas.getAllByText(/wants/i);
//       await expect(wantsElements.length).toBeGreaterThan(0);
//       const savingsElements = canvas.getAllByText(/savings/i);
//       await expect(savingsElements.length).toBeGreaterThan(0);
//     });
//
//     await step("Submit form and verify callback", async () => {
//       const continueButton = canvas.getByRole("button", { name: /continue/i });
//       await userEvent.click(continueButton);
//
//       await waitFor(async () => {
//         await expect(args.onContinueAction).toHaveBeenCalled();
//       });
//     });
//   }
// };
//
// /**
//  * Tests validation errors when submitting with invalid data (empty allocations).
//  */
// export const ErrorValidation: Story = {
//   args: {
//     defaultValues: {
//       budgetProfileId: "custom",
//       monthlyIncome: 8000,
//       allocations: [],
//       totalAllocated: 0,
//       totalPercentage: 0,
//       remainingAmount: 8000
//     }
//   },
//   play: async ({ canvas, args, step }) => {
//     await step("Try to submit without any allocations", async () => {
//       const continueButton = canvas.getByRole("button", { name: /continue/i });
//       await userEvent.click(continueButton);
//     });
//
//     await step("Verify validation error appears", async () => {
//       await waitFor(async () => {
//         const errorMessage = canvas.getByRole("alert");
//         await expect(errorMessage).toBeVisible();
//         await expect(errorMessage).toHaveTextContent(/at least one allocation is required/i);
//       });
//     });
//
//     await step("Verify onContinueAction was NOT called due to validation error", async () => {
//       await expect(args.onContinueAction).not.toHaveBeenCalled();
//     });
//   }
// };
//
// /**
//  * Tests the interaction flow:
//  * 1. Modify amount and verify total updates
//  * 2. Add new category to an allocation
//  * 3. Submit form
//  */
// export const Interaction: Story = {
//   play: async ({ canvas, args, step }) => {
//     await step("Wait for initial render with allocation sections", async () => {
//       await waitFor(async () => {
//         const needsElements = canvas.getAllByText(/needs/i);
//         await expect(needsElements.length).toBeGreaterThan(0);
//       });
//     });
//
//     await step("Get first category amount input and modify it", async () => {
//       const amountInputs = canvas.getAllByRole("spinbutton");
//       const firstAmountInput = amountInputs[0]!;
//       await expect(firstAmountInput).toBeVisible();
//
//       await userEvent.clear(firstAmountInput);
//       await userEvent.type(firstAmountInput, "3000");
//     });
//
//     await step("Verify total allocated updates", async () => {
//       await waitFor(async () => {
//         const allocatedTexts = canvas.getAllByText(/allocated:/i);
//         await expect(allocatedTexts.length).toBeGreaterThan(0);
//       });
//     });
//
//     await step("Add new category to first allocation", async () => {
//       const addButtons = canvas.getAllByRole("button", { name: /add category/i });
//       const initialInputCount = canvas.getAllByRole("spinbutton").length;
//
//       await userEvent.click(addButtons[0]!);
//
//       await waitFor(async () => {
//         const newInputCount = canvas.getAllByRole("spinbutton").length;
//         await expect(newInputCount).toBe(initialInputCount + 1);
//       });
//     });
//
//     await step("Submit the form", async () => {
//       const continueButton = canvas.getByRole("button", { name: /continue/i });
//       await userEvent.click(continueButton);
//     });
//
//     await step("Verify onContinueAction was called", async () => {
//       await waitFor(async () => {
//         await expect(args.onContinueAction).toHaveBeenCalled();
//       });
//     });
//   }
// };
//
// /**
//  * Tests modifying multiple category amounts and verifying totals update correctly.
//  */
// export const ModifyMultipleAmounts: Story = {
//   play: async ({ canvas, step }) => {
//     await step("Wait for form to render", async () => {
//       await waitFor(async () => {
//         await expect(canvas.getByText(/needs/i)).toBeVisible();
//       });
//     });
//
//     await step("Modify first two category amounts", async () => {
//       const amountInputs = canvas.getAllByRole("spinbutton");
//
//       // Modify first input
//       await userEvent.clear(amountInputs[0]!);
//       await userEvent.type(amountInputs[0]!, "2500");
//
//       // Modify second input
//       await userEvent.clear(amountInputs[1]!);
//       await userEvent.type(amountInputs[1]!, "1500");
//     });
//
//     await step("Verify allocated amount reflects changes", async () => {
//       await waitFor(async () => {
//         const allocatedTexts = canvas.getAllByText(/allocated:/i);
//         await expect(allocatedTexts.length).toBeGreaterThan(0);
//       });
//     });
//
//     await step("Verify progress bar updates", async () => {
//       const progressBar = canvas.getByRole("progressbar");
//       await expect(progressBar).toBeVisible();
//     });
//   }
// };
//
// /**
//  * Tests back button functionality.
//  */
// export const BackNavigation: Story = {
//   play: async ({ canvas, args, step }) => {
//     await step("Verify back button is visible", async () => {
//       const backButton = canvas.getByRole("button", { name: /back/i });
//       await expect(backButton).toBeVisible();
//     });
//
//     await step("Click back button", async () => {
//       const backButton = canvas.getByRole("button", { name: /back/i });
//       await userEvent.click(backButton);
//     });
//
//     await step("Verify onBackAction was called", async () => {
//       await expect(args.onBackAction).toHaveBeenCalledOnce();
//     });
//   }
// };
//
// /**
//  * Tests that categories can be added dynamically to allocations.
//  */
// export const AddMultipleCategories: Story = {
//   play: async ({ canvas, step }) => {
//     let initialInputCount: number;
//
//     await step("Get initial input count", async () => {
//       const initialInputs = canvas.getAllByRole("spinbutton");
//       initialInputCount = initialInputs.length;
//       await expect(initialInputCount).toBeGreaterThan(0);
//     });
//
//     await step("Add category to first allocation", async () => {
//       const addButtons = canvas.getAllByRole("button", { name: /add category/i });
//       await userEvent.click(addButtons[0]!);
//     });
//
//     await step("Verify first category was added", async () => {
//       await waitFor(async () => {
//         const inputs = canvas.getAllByRole("spinbutton");
//         await expect(inputs.length).toBe(initialInputCount! + 1);
//       });
//     });
//
//     await step("Add another category to first allocation", async () => {
//       const addButtons = canvas.getAllByRole("button", { name: /add category/i });
//       await userEvent.click(addButtons[0]!);
//     });
//
//     await step("Verify second category was added", async () => {
//       await waitFor(async () => {
//         const inputs = canvas.getAllByRole("spinbutton");
//         await expect(inputs.length).toBe(initialInputCount! + 2);
//       });
//     });
//
//     await step("Verify new categories have default name", async () => {
//       const newCategoryLabels = canvas.getAllByText(/new category/i);
//       await expect(newCategoryLabels.length).toBeGreaterThanOrEqual(1);
//     });
//   }
// };
//
// /**
//  * Tests removing a category from an allocation.
//  */
// export const RemoveCategory: Story = {
//   play: async ({ canvas, step }) => {
//     let initialInputCount: number;
//
//     await step("Get initial input count", async () => {
//       const initialInputs = canvas.getAllByRole("spinbutton");
//       initialInputCount = initialInputs.length;
//       await expect(initialInputCount).toBeGreaterThan(1);
//     });
//
//     await step("Click remove button on a category", async () => {
//       // Find delete buttons (trash icons)
//       const deleteButtons = canvas.getAllByRole("button", { name: /remove/i });
//
//       // Click the first delete button that's enabled
//       const enabledDeleteButton = deleteButtons.find((btn) => !btn.hasAttribute("disabled"));
//       if (enabledDeleteButton) {
//         await userEvent.click(enabledDeleteButton);
//       }
//     });
//
//     await step("Verify category was removed", async () => {
//       await waitFor(async () => {
//         const inputs = canvas.getAllByRole("spinbutton");
//         await expect(inputs.length).toBe(initialInputCount! - 1);
//       });
//     });
//   }
// };
//
// /**
//  * Tests that the last category in an allocation cannot be removed (delete button should be disabled).
//  */
// export const CannotRemoveLastCategory: Story = {
//   args: {
//     defaultValues: {
//       budgetProfileId: "custom",
//       monthlyIncome: 8000,
//       allocations: [
//         {
//           type: "needs",
//           percentage: 100,
//           amount: 8000,
//           label: "Needs",
//           categories: [
//             {
//               id: "single-category",
//               name: "Single Category",
//               icon: "home",
//               color: "#3b82f6",
//               percentage: 100,
//               amount: 8000,
//               order: 0
//             }
//           ]
//         }
//       ],
//       totalAllocated: 8000,
//       totalPercentage: 100,
//       remainingAmount: 0
//     }
//   },
//   play: async ({ canvas, step }) => {
//     await step("Verify only one category exists", async () => {
//       const amountInputs = canvas.getAllByRole("spinbutton");
//       await expect(amountInputs.length).toBe(1);
//     });
//
//     await step("Verify delete button is disabled", async () => {
//       const deleteButton = canvas.getByRole("button", { name: /remove single category/i });
//       await expect(deleteButton).toBeDisabled();
//     });
//   }
// };
//
// /**
//  * Tests that remaining amount shows negative value when over-allocated.
//  */
// export const OverBudget: Story = {
//   args: {
//     defaultValues: {
//       budgetProfileId: "custom",
//       monthlyIncome: 8000,
//       allocations: [
//         {
//           type: "needs",
//           percentage: 62.5,
//           amount: 5000,
//           label: "Needs",
//           categories: [
//             {
//               id: "housing",
//               name: "Housing",
//               icon: "home",
//               color: "#3b82f6",
//               percentage: 62.5,
//               amount: 5000,
//               order: 0
//             }
//           ]
//         },
//         {
//           type: "wants",
//           percentage: 50,
//           amount: 4000,
//           label: "Wants",
//           categories: [
//             {
//               id: "entertainment",
//               name: "Entertainment",
//               icon: "film",
//               color: "#8b5cf6",
//               percentage: 50,
//               amount: 4000,
//               order: 0
//             }
//           ]
//         }
//       ],
//       totalAllocated: 9000,
//       totalPercentage: 112.5,
//       remainingAmount: -1000
//     }
//   },
//   play: async ({ canvas, step }) => {
//     await step("Verify allocated amount exceeds monthly income", async () => {
//       await waitFor(async () => {
//         const allocatedTexts = canvas.getAllByText(/allocated:/i);
//         await expect(allocatedTexts.length).toBeGreaterThan(0);
//       });
//     });
//
//     await step("Verify remaining amount text is visible", async () => {
//       const remainingTexts = canvas.getAllByText(/remaining:/i);
//       await expect(remainingTexts.length).toBeGreaterThan(0);
//     });
//
//     await step("Verify remaining amount has error styling (negative value)", async () => {
//       await waitFor(async () => {
//         // Find the element containing the negative remaining value in the summary section
//         const remainingTexts = canvas.getAllByText(/remaining:/i);
//         // The first one is in the summary section
//         const summaryRemaining = remainingTexts[0]?.closest("span");
//         await expect(summaryRemaining).toHaveClass(/text-error/);
//       });
//     });
//   }
// };
//
// /**
//  * Tests under-budget scenario where not all income is allocated.
//  */
// export const UnderBudget: Story = {
//   args: {
//     defaultValues: {
//       budgetProfileId: "custom",
//       monthlyIncome: 10000,
//       allocations: [
//         {
//           type: "needs",
//           percentage: 30,
//           amount: 3000,
//           label: "Needs",
//           categories: [
//             {
//               id: "housing",
//               name: "Housing",
//               icon: "home",
//               color: "#3b82f6",
//               percentage: 30,
//               amount: 3000,
//               order: 0
//             }
//           ]
//         }
//       ],
//       totalAllocated: 3000,
//       totalPercentage: 30,
//       remainingAmount: 7000
//     }
//   },
//   play: async ({ canvas, step }) => {
//     await step("Verify allocated amount is less than monthly income", async () => {
//       const allocatedTexts = canvas.getAllByText(/allocated:/i);
//       await expect(allocatedTexts.length).toBeGreaterThan(0);
//     });
//
//     await step("Verify remaining amount is positive", async () => {
//       const remainingTexts = canvas.getAllByText(/remaining:/i);
//       await expect(remainingTexts.length).toBeGreaterThan(0);
//     });
//
//     await step("Verify remaining amount has success styling (positive value)", async () => {
//       await waitFor(async () => {
//         // Find the remaining text in the summary section
//         const remainingTexts = canvas.getAllByText(/remaining:/i);
//         const summaryRemaining = remainingTexts[0]?.closest("span");
//         await expect(summaryRemaining).toHaveClass(/text-success/);
//       });
//     });
//
//     await step("Verify progress bar shows partial allocation", async () => {
//       const progressBar = canvas.getByRole("progressbar");
//       await expect(progressBar).toBeVisible();
//       // Progress bar value should reflect the percentage
//       const value = progressBar.getAttribute("aria-valuenow");
//       await expect(Number(value)).toBeGreaterThan(0);
//     });
//   }
// };
//
// /**
//  * Tests that form works with custom budget template.
//  */
// export const CustomTemplate: Story = {
//   args: {
//     budgetTemplate: createTestBudgetTemplate.custom(),
//     defaultValues: undefined
//   },
//   play: async ({ canvas, args, step }) => {
//     await step("Verify custom template name is shown in description", async () => {
//       await expect(canvas.getByText(/custom/i)).toBeVisible();
//     });
//
//     await step("Verify empty state message or minimal allocations", async () => {
//       // Custom template has empty allocations
//       await waitFor(async () => {
//         const inputs = canvas.queryAllByRole("spinbutton");
//         // Custom template may have no inputs initially
//         await expect(inputs.length).toBeGreaterThanOrEqual(0);
//       });
//     });
//   }
// };
//
// /**
//  * Tests the family budget template with more categories.
//  */
// export const FamilyTemplate: Story = {
//   args: {
//     budgetTemplate: createTestBudgetTemplate.family(),
//     monthlyIncome: 12000,
//     defaultValues: undefined
//   },
//   play: async ({ canvas, step }) => {
//     await step("Verify family template name is shown", async () => {
//       await waitFor(async () => {
//         await expect(canvas.getByText(/family/i)).toBeVisible();
//       });
//     });
//
//     await step("Verify all allocation types are present", async () => {
//       await expect(canvas.getByText(/needs/i)).toBeVisible();
//       await expect(canvas.getByText(/wants/i)).toBeVisible();
//       await expect(canvas.getByText(/savings/i)).toBeVisible();
//     });
//
//     await step("Verify calculated amounts based on 12000 income", async () => {
//       const inputs = canvas.getAllByRole("spinbutton");
//       await expect(inputs.length).toBeGreaterThan(0);
//     });
//   }
// };
//
// /**
//  * Tests the aggressive saver template (40/10/50 split).
//  */
// export const AggressiveSaverTemplate: Story = {
//   args: {
//     budgetTemplate: createTestBudgetTemplate.aggressiveSaver(),
//     monthlyIncome: 10000,
//     defaultValues: undefined
//   },
//   play: async ({ canvas, step }) => {
//     await step("Verify aggressive saver template is loaded", async () => {
//       await waitFor(async () => {
//         await expect(canvas.getByText(/aggressive saver/i)).toBeVisible();
//       });
//     });
//
//     await step("Verify allocation sections are present", async () => {
//       await expect(canvas.getByText(/needs/i)).toBeVisible();
//       await expect(canvas.getByText(/wants/i)).toBeVisible();
//       await expect(canvas.getByText(/savings/i)).toBeVisible();
//     });
//   }
// };
//
// /**
//  * Tests the student template (60/25/15 split).
//  */
// export const StudentTemplate: Story = {
//   args: {
//     budgetTemplate: createTestBudgetTemplate.student(),
//     monthlyIncome: 3000,
//     defaultValues: undefined
//   },
//   play: async ({ canvas, step }) => {
//     await step("Verify student template is loaded", async () => {
//       await waitFor(async () => {
//         await expect(canvas.getByText(/student/i)).toBeVisible();
//       });
//     });
//
//     await step("Verify allocation sections are present", async () => {
//       await expect(canvas.getByText(/needs/i)).toBeVisible();
//       await expect(canvas.getByText(/wants/i)).toBeVisible();
//       await expect(canvas.getByText(/savings/i)).toBeVisible();
//     });
//   }
// };
//
// /**
//  * Tests error handling when server action returns failure.
//  */
// export const ServerErrorHandling: Story = {
//   args: {
//     onContinueAction: fn(
//       async () =>
//         ({
//           success: false as const,
//           error: "Failed to save budget details. Please try again."
//         }) as unknown as RedirectAction
//     )
//   },
//   play: async ({ canvas, args, step }) => {
//     await step("Fill in some data and submit", async () => {
//       const continueButton = canvas.getByRole("button", { name: /continue/i });
//       await userEvent.click(continueButton);
//     });
//
//     await step("Verify server action was called", async () => {
//       await waitFor(async () => {
//         await expect(args.onContinueAction).toHaveBeenCalled();
//       });
//     });
//
//     // Note: Toast verification would require additional setup
//     // The component shows error via toast.error()
//   }
// };
//
// /**
//  * Tests complete user flow: view form, modify amounts, add category, and submit.
//  */
// export const CompleteUserFlow: Story = {
//   args: {
//     onContinueAction: fn(
//       () =>
//         ({
//           success: true
//         }) as unknown as RedirectAction
//     )
//   },
//   play: async ({ canvas, args, step }) => {
//     await step("Verify initial form state", async () => {
//       await expect(canvas.getByText(/budget details/i)).toBeVisible();
//       await expect(canvas.getByText(/needs/i)).toBeVisible();
//     });
//
//     await step("Modify first category amount", async () => {
//       const amountInputs = canvas.getAllByRole("spinbutton");
//       await userEvent.clear(amountInputs[0]!);
//       await userEvent.type(amountInputs[0]!, "2500");
//     });
//
//     await step("Verify total updates", async () => {
//       await waitFor(async () => {
//         const allocatedTexts = canvas.getAllByText(/allocated:/i);
//         await expect(allocatedTexts.length).toBeGreaterThan(0);
//       });
//     });
//
//     await step("Add a new category", async () => {
//       const addButtons = canvas.getAllByRole("button", { name: /add category/i });
//       const initialCount = canvas.getAllByRole("spinbutton").length;
//       await userEvent.click(addButtons[0]!);
//
//       await waitFor(async () => {
//         const newCount = canvas.getAllByRole("spinbutton").length;
//         await expect(newCount).toBe(initialCount + 1);
//       });
//     });
//
//     await step("Fill in the new category amount", async () => {
//       const amountInputs = canvas.getAllByRole("spinbutton");
//       const lastInput = amountInputs[amountInputs.length - 1]!;
//       await userEvent.type(lastInput, "500");
//     });
//
//     await step("Submit the form", async () => {
//       const continueButton = canvas.getByRole("button", { name: /continue/i });
//       await userEvent.click(continueButton);
//     });
//
//     await step("Verify form was submitted successfully", async () => {
//       await waitFor(async () => {
//         await expect(args.onContinueAction).toHaveBeenCalledOnce();
//       });
//     });
//   }
// };
//
// /**
//  * Tests form with different currency display (USD).
//  */
// export const WithUSDCurrency: Story = {
//   args: {
//     preferences: onboardingPreferencesBuilder.one({ traits: ["usd"] }),
//     monthlyIncome: 5000
//   },
//   play: async ({ canvas, step }) => {
//     await step("Verify form renders with USD amounts", async () => {
//       await expect(canvas.getByText(/budget details/i)).toBeVisible();
//     });
//
//     await step("Verify currency is displayed correctly", async () => {
//       // USD amounts should be formatted with $ symbol
//       await waitFor(async () => {
//         const moneyTexts = canvas.getAllByText(/\$/);
//         await expect(moneyTexts.length).toBeGreaterThan(0);
//       });
//     });
//   }
// };
//
// /**
//  * Tests form with builder-generated data for family profile.
//  */
// export const BuilderFamilyData: Story = {
//   args: {
//     defaultValues: createTestBudgetDetails.family(),
//     budgetTemplate: createTestBudgetTemplate.family(),
//     monthlyIncome: 12000
//   },
//   play: async ({ canvas, step }) => {
//     await step("Verify form is populated with budget data", async () => {
//       await waitFor(async () => {
//         // Builder generates allocations with Needs/Wants/Savings labels
//         await expect(canvas.getByText(/needs/i)).toBeVisible();
//       });
//     });
//
//     await step("Verify multiple category inputs exist", async () => {
//       const inputs = canvas.getAllByRole("spinbutton");
//       await expect(inputs.length).toBeGreaterThan(5);
//     });
//   }
// };
//
// /**
//  * Tests loading state when form is submitting.
//  */
// export const LoadingState: Story = {
//   args: {
//     onContinueAction: fn(
//       async () =>
//         new Promise((resolve) => {
//           setTimeout(
//             () =>
//               resolve({
//                 success: true
//               } as unknown as ReturnType<typeof meta.args.onContinueAction>),
//             3000
//           );
//         })
//     )
//   },
//   play: async ({ canvas, step }) => {
//     await step("Click continue button to trigger loading", async () => {
//       const continueButton = canvas.getByRole("button", { name: /continue/i });
//       await userEvent.click(continueButton);
//     });
//
//     await step("Verify button shows loading state", async () => {
//       await waitFor(async () => {
//         const continueButton = canvas.getByRole("button", { name: /continue/i });
//         // Button should be disabled during submission
//         await expect(continueButton).toBeDisabled();
//       });
//     });
//   }
// };
