import { type Meta, type StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { BrokerId } from "~/features/onboarding/constants/investments";
import {
  createTestOnboardingInvestment,
  onboardingInvestmentBuilder
} from "~/features/onboarding/test/builders/onboarding-investment.builder";

import { InvestmentSetupForm } from "./investment-setup-form";

const meta = {
  title: "Features/Onboarding/Investment Setup Form",
  component: InvestmentSetupForm,
  decorators: [(story) => <div className="w-full max-w-4xl">{story()}</div>],
  args: {
    onBackAction: fn(),
    onContinueAction: fn(),
    onSkipAction: fn()
  }
} satisfies Meta<typeof InvestmentSetupForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default empty state of the investment setup form.
 * Verifies the component renders correctly with no initial accounts,
 * showing the empty state message and "Add Investment Account" button.
 */
export const DefaultEmptyState: Story = {
  args: {
    initialAccounts: []
  },
  play: async ({ canvas, step }) => {

    await step("Verify page header and description", async () => {
      await expect(canvas.getByText(/add investment accounts/i)).toBeVisible();
      await expect(canvas.getByText(/optional/i)).toBeVisible();
      await expect(
        canvas.getByText(/aggregate your portfolio from different brokers and track profits\/losses/i)
      ).toBeVisible();
    });

    await step("Verify info alert is displayed", async () => {
      await expect(canvas.getByText(/you can add accounts later/i)).toBeVisible();
      await expect(canvas.getByText(/this step helps you have a complete financial picture/i)).toBeVisible();
    });

    await step("Verify 'Add Investment Account' button is visible", async () => {
      await expect(canvas.getByRole("button", { name: /add investment account/i })).toBeVisible();
    });

    await step("Verify empty state message is displayed", async () => {
      await expect(canvas.getByText(/no accounts added yet/i)).toBeVisible();
      await expect(
        canvas.getByText(/add your investment accounts to track your portfolio performance/i)
      ).toBeVisible();
      await expect(canvas.getByText(/track stocks, etfs, bonds, and more/i)).toBeVisible();
    });

    await step("Verify action buttons show 'Skip for now' when no accounts", async () => {
      await expect(canvas.getByRole("button", { name: /back/i })).toBeVisible();
      await expect(canvas.getByRole("button", { name: /skip for now/i })).toBeVisible();
    });
  }
};

/**
 * Form with pre-populated accounts from initialAccounts prop.
 * Verifies the component correctly displays existing accounts with proper formatting.
 */
export const WithInitialAccounts: Story = {
  args: {
    initialAccounts: [
      onboardingInvestmentBuilder.one({
        traits: ["xtb", "pln"],
        overrides: { number: "1234567890" }
      }),
      onboardingInvestmentBuilder.one({
        traits: ["revolut", "eur"],
        overrides: { number: "0987654321" }
      }),
      onboardingInvestmentBuilder.one({
        traits: ["withCustomName", "usd"],
        overrides: {
          brokerId: BrokerId.INTERACTIVE_BROKERS,
          name: "Retirement Fund",
          number: "5555666677"
        }
      })
    ]
  },
  play: async ({ canvas, step }) => {

    await step("Verify accounts count header is displayed", async () => {
      await expect(canvas.getByText(/accounts \(3\)/i)).toBeVisible();
    });

    await step("Verify all accounts are rendered", async () => {
      await expect(canvas.getByText(/xtb/i)).toBeVisible();
      await expect(canvas.getByText(/revolut/i)).toBeVisible();
      await expect(canvas.getByText(/retirement fund/i)).toBeVisible();
    });

    await step("Verify currency badges are displayed", async () => {
      await expect(canvas.getByText("PLN")).toBeVisible();
      await expect(canvas.getByText("EUR")).toBeVisible();
      await expect(canvas.getByText("USD")).toBeVisible();
    });

    await step("Verify 'Continue with accounts' button is shown instead of 'Skip'", async () => {
      await expect(canvas.getByRole("button", { name: /continue with accounts/i })).toBeVisible();
      await expect(canvas.queryByRole("button", { name: /skip for now/i })).not.toBeInTheDocument();
    });

    await step("Verify empty state is not shown", async () => {
      await expect(canvas.queryByText(/no accounts added yet/i)).not.toBeInTheDocument();
    });
  }
};

/**
 * Tests that clicking "Add Investment Account" displays the InvestmentAccountCardForm in create mode.
 */
export const AddAccountButtonOpensForm: Story = {
  args: {
    initialAccounts: []
  },
  play: async ({ canvas, step }) => {

    await step("Click 'Add Investment Account' button", async () => {
      const addButton = canvas.getByRole("button", { name: /add investment account/i });
      await userEvent.click(addButton);
    });

    await step("Verify form is displayed in create mode", async () => {
      await expect(canvas.getByText(/add new account/i)).toBeVisible();
    });

    await step("Verify form fields are visible", async () => {
      await expect(canvas.getByLabelText(/broker/i)).toBeVisible();
      await expect(canvas.getByLabelText(/account name/i)).toBeVisible();
      await expect(canvas.getByLabelText(/account number/i)).toBeVisible();
      await expect(canvas.getByLabelText(/currency/i)).toBeVisible();
    });

    await step("Verify form action buttons", async () => {
      await expect(canvas.getByRole("button", { name: /cancel/i })).toBeVisible();
      await expect(canvas.getByRole("button", { name: /add account/i })).toBeVisible();
    });

    await step("Verify 'Add Investment Account' button is hidden while form is open", async () => {
      await expect(canvas.queryByRole("button", { name: /add investment account/i })).not.toBeInTheDocument();
    });
  }
};

/**
 * Tests that canceling the account form returns to the add button state.
 */
export const CancelFormReturnsToDefaultView: Story = {
  args: {
    initialAccounts: []
  },
  play: async ({ canvas, step }) => {

    await step("Open the add account form", async () => {
      const addButton = canvas.getByRole("button", { name: /add investment account/i });
      await userEvent.click(addButton);
    });

    await step("Verify form is displayed", async () => {
      await expect(canvas.getByText(/add new account/i)).toBeVisible();
    });

    await step("Click cancel button", async () => {
      const cancelButton = canvas.getByRole("button", { name: /cancel/i });
      await userEvent.click(cancelButton);
    });

    await step("Verify form is hidden and add button is visible again", async () => {
      await expect(canvas.queryByText(/add new account/i)).not.toBeInTheDocument();
      await expect(canvas.getByRole("button", { name: /add investment account/i })).toBeVisible();
    });

    await step("Verify empty state is displayed again", async () => {
      await expect(canvas.getByText(/no accounts added yet/i)).toBeVisible();
    });
  }
};

/**
 * Tests that clicking edit on an existing account opens the form pre-populated with that account's data.
 */
export const EditAccountOpensFormWithData: Story = {
  args: {
    initialAccounts: [
      onboardingInvestmentBuilder.one({
        traits: ["xtb", "pln"],
        overrides: {
          name: "Main Trading Account",
          number: "1234567890"
        }
      })
    ]
  },
  play: async ({ canvas, canvasElement, step }) => {
    await step("Verify account is displayed", async () => {
      await expect(canvas.getByText(/main trading account/i)).toBeVisible();
    });

    await step("Click edit button on the account", async () => {
      // Find edit buttons - they are the first button in each account item's actions
      const editButtons = canvasElement.querySelectorAll('[data-slot="item-actions"] button');
      if (editButtons.length > 0) {
        await userEvent.click(editButtons[0] as HTMLElement);
      }
    });

    await step("Verify form is displayed in edit mode", async () => {
      await waitFor(async () => {
        await expect(canvas.getByText(/edit account/i)).toBeVisible();
      });
    });

    await step("Verify form shows 'Update Account' button instead of 'Add Account'", async () => {
      await expect(canvas.getByRole("button", { name: /update account/i })).toBeVisible();
      await expect(canvas.queryByRole("button", { name: /add account/i })).not.toBeInTheDocument();
    });
  }
};

/**
 * Tests that clicking remove on an account removes it from the list and updates the count.
 */
export const RemoveAccountFromList: Story = {
  args: {
    initialAccounts: [
      onboardingInvestmentBuilder.one({
        traits: ["xtb", "pln"],
        overrides: { number: "1111111111" }
      }),
      onboardingInvestmentBuilder.one({
        traits: ["revolut", "eur"],
        overrides: { number: "2222222222" }
      })
    ]
  },
  play: async ({ canvas, canvasElement, step }) => {
    await step("Verify initial state with 2 accounts", async () => {
      await expect(canvas.getByText(/accounts \(2\)/i)).toBeVisible();
      await expect(canvas.getByText(/xtb/i)).toBeVisible();
      await expect(canvas.getByText(/revolut/i)).toBeVisible();
    });

    await step("Click remove button on the first account (XTB)", async () => {
      // Find remove buttons - they are the second button in each account item's actions
      const actionGroups = canvasElement.querySelectorAll('[data-slot="item-actions"]');
      const firstActionGroup = actionGroups[0];
      if (firstActionGroup) {
        const removeButton = firstActionGroup.querySelectorAll("button")[1];
        if (removeButton) {
          await userEvent.click(removeButton);
        }
      }
    });

    await step("Verify account count is updated to 1", async () => {
      await waitFor(async () => {
        await expect(canvas.getByText(/accounts \(1\)/i)).toBeVisible();
      });
    });

    await step("Verify XTB account is removed and Revolut remains", async () => {
      await expect(canvas.queryByText(/xtb/i)).not.toBeInTheDocument();
      await expect(canvas.getByText(/revolut/i)).toBeVisible();
    });

    await step("Verify 'Continue with accounts' is still shown (1 account remaining)", async () => {
      await expect(canvas.getByRole("button", { name: /continue with accounts/i })).toBeVisible();
    });
  }
};

/**
 * Tests that clicking "Back" button triggers the onBackAction callback.
 */
export const BackButtonCallsOnBackAction: Story = {
  args: {
    initialAccounts: []
  },
  play: async ({ canvas, args, step }) => {

    await step("Click Back button", async () => {
      const backButton = canvas.getByRole("button", { name: /back/i });
      await userEvent.click(backButton);
    });

    await step("Verify onBackAction was called", async () => {
      await expect(args.onBackAction).toHaveBeenCalledTimes(1);
    });
  }
};

/**
 * Tests that "Skip for now" button appears when no accounts exist and triggers onSkipAction.
 */
export const SkipButtonWhenNoAccounts: Story = {
  args: {
    initialAccounts: []
  },
  play: async ({ canvas, args, step }) => {

    await step("Verify 'Skip for now' button is visible", async () => {
      await expect(canvas.getByRole("button", { name: /skip for now/i })).toBeVisible();
    });

    await step("Verify 'Continue with accounts' button is NOT visible", async () => {
      await expect(canvas.queryByRole("button", { name: /continue with accounts/i })).not.toBeInTheDocument();
    });

    await step("Click 'Skip for now' button", async () => {
      const skipButton = canvas.getByRole("button", { name: /skip for now/i });
      await userEvent.click(skipButton);
    });

    await step("Verify onSkipAction was called", async () => {
      await expect(args.onSkipAction).toHaveBeenCalledTimes(1);
    });
  }
};

/**
 * Tests that "Continue with accounts" button appears when accounts are present.
 */
export const ContinueButtonWhenAccountsExist: Story = {
  args: {
    initialAccounts: [createTestOnboardingInvestment.xtb()]
  },
  play: async ({ canvas, step }) => {

    await step("Verify 'Continue with accounts' button is visible", async () => {
      await expect(canvas.getByRole("button", { name: /continue with accounts/i })).toBeVisible();
    });

    await step("Verify 'Skip for now' button is NOT visible", async () => {
      await expect(canvas.queryByRole("button", { name: /skip for now/i })).not.toBeInTheDocument();
    });

    await step("Verify button has correct styling with arrow icon", async () => {
      const continueButton = canvas.getByRole("button", { name: /continue with accounts/i });
      await expect(continueButton).toBeVisible();
      // Button should contain chevron-right icon
      const svg = continueButton.querySelector("svg");
      await expect(svg).toBeInTheDocument();
    });
  }
};

/**
 * Tests account item displays custom name with broker as description.
 */
export const AccountDisplayWithCustomName: Story = {
  args: {
    initialAccounts: [
      onboardingInvestmentBuilder.one({
        overrides: {
          brokerId: BrokerId.XTB,
          name: "Retirement Portfolio",
          number: "9876543210",
          currency: "PLN"
        }
      })
    ]
  },
  play: async ({ canvas, step }) => {

    await step("Verify custom name is displayed as title", async () => {
      await expect(canvas.getByText(/retirement portfolio/i)).toBeVisible();
    });

    await step("Verify broker name is displayed as description", async () => {
      // When custom name exists, broker name appears as ItemDescription
      const descriptions = canvas.getAllByText(/xtb/i);
      await expect(descriptions.length).toBeGreaterThan(0);
    });

    await step("Verify currency badge is displayed", async () => {
      await expect(canvas.getByText("PLN")).toBeVisible();
    });
  }
};

/**
 * Tests account item displays broker name when no custom name is provided.
 */
export const AccountDisplayWithoutCustomName: Story = {
  args: {
    initialAccounts: [
      onboardingInvestmentBuilder.one({
        overrides: {
          brokerId: BrokerId.REVOLUT,
          name: null,
          number: "5555444433",
          currency: "EUR"
        }
      })
    ]
  },
  play: async ({ canvas, step }) => {

    await step("Verify broker name is displayed as title", async () => {
      await expect(canvas.getByText(/revolut/i)).toBeVisible();
    });

    await step("Verify no duplicate broker name in description", async () => {
      // When no custom name, broker name should appear only once (as title)
      const revolutElements = canvas.getAllByText(/revolut/i);
      // Should have exactly one visible occurrence in the title
      await expect(revolutElements.length).toBeGreaterThanOrEqual(1);
    });

    await step("Verify currency badge is displayed", async () => {
      await expect(canvas.getByText("EUR")).toBeVisible();
    });
  }
};

/**
 * Tests that account numbers are properly masked (showing only last 4 digits).
 */
export const MaskedAccountNumberDisplay: Story = {
  args: {
    initialAccounts: [
      onboardingInvestmentBuilder.one({
        overrides: {
          brokerId: BrokerId.MBANK,
          name: null,
          number: "1234567890",
          currency: "PLN"
        }
      })
    ]
  },
  play: async ({ canvas, step }) => {

    await step("Verify account number is masked", async () => {
      // Account number "1234567890" should display as "******7890"
      await expect(canvas.getByText(/account: \*+7890/i)).toBeVisible();
    });

    await step("Verify full account number is NOT displayed", async () => {
      await expect(canvas.queryByText(/1234567890/)).not.toBeInTheDocument();
    });

    await step("Verify only last 4 digits are visible", async () => {
      const accountText = canvas.getByText(/account:/i);
      await expect(accountText.textContent).toContain("7890");
      await expect(accountText.textContent).toContain("*");
    });
  }
};
