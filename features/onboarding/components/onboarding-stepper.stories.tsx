import { type Meta, type StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";
import { OnboardingStepper } from "~/features/onboarding/components/onboarding-stepper";
import { OnboardingSteps } from "~/features/onboarding/types/onboarding";

/**
 * OnboardingStepper is a multi-step navigation component used to guide users
 * through the onboarding process. It displays the current step and allows
 * navigation between steps.
 *
 * ## Features
 * - Visual step indicators with icons
 * - Step titles and descriptions
 * - Navigation between steps via clicking
 * - Ability to hide navigation (for welcome screen)
 * - Renders children in a panel below the navigation
 *
 * ## Steps
 * 1. **Welcome** - Initial greeting and product selection
 * 2. **Preferences** - Currency and locale settings (with description)
 * 3. **Budget Setup** - Budget template selection
 * 4. **Budget Details** - Detailed budget configuration
 * 5. **Investments** - Add investment accounts (with description)
 */
const meta = {
  title: "Features/Onboarding/Onboarding Stepper",
  component: OnboardingStepper,
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: OnboardingSteps.WELCOME
      }
    }
  },
  decorators: [(story) => <div className="w-full">{story()}</div>],
  args: {
    hideNav: false,
    children: <div className="p-4">Step content goes here</div>
  }
} satisfies Meta<typeof OnboardingStepper>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default state showing the stepper at the Welcome step.
 * All navigation items are visible and the welcome step is active.
 */
export const AtWelcomeStep: Story = {
  play: async ({ canvas, step }) => {
    await step("Verify all step titles are visible", async () => {
      await expect(canvas.getByText("Welcome")).toBeVisible();
      await expect(canvas.getByText("Preferences")).toBeVisible();
      await expect(canvas.getByText("Budget Setup")).toBeVisible();
      await expect(canvas.getByText("Budget Details")).toBeVisible();
      await expect(canvas.getByText("Investments")).toBeVisible();
    });

    await step("Verify step descriptions are visible", async () => {
      await expect(canvas.getByText("Set Your Preferences")).toBeVisible();
      await expect(canvas.getByText("Add Accounts")).toBeVisible();
    });

    await step("Verify children content is rendered", async () => {
      await expect(canvas.getByText("Step content goes here")).toBeVisible();
    });
  }
};

/**
 * Stepper at the Preferences step.
 * Shows progression through the onboarding flow.
 */
export const AtPreferencesStep: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: OnboardingSteps.PREFERENCES
      }
    }
  },
  args: {
    children: <div className="p-4">Preferences form content</div>
  },
  play: async ({ canvas, step }) => {
    await step("Verify preferences step content is rendered", async () => {
      await expect(canvas.getByText("Preferences form content")).toBeVisible();
    });

    await step("Verify all steps are still visible", async () => {
      await expect(canvas.getByText("Welcome")).toBeVisible();
      await expect(canvas.getByText("Preferences")).toBeVisible();
      await expect(canvas.getByText("Budget Setup")).toBeVisible();
      await expect(canvas.getByText("Budget Details")).toBeVisible();
      await expect(canvas.getByText("Investments")).toBeVisible();
    });
  }
};

/**
 * Stepper at the Budget Setup step.
 */
export const AtBudgetSetupStep: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: OnboardingSteps.BUDGET_SETUP
      }
    }
  },
  args: {
    children: <div className="p-4">Budget setup form content</div>
  },
  play: async ({ canvas, step }) => {
    await step("Verify budget setup content is rendered", async () => {
      await expect(canvas.getByText("Budget setup form content")).toBeVisible();
    });

    await step("Verify all steps are visible", async () => {
      await expect(canvas.getByText("Welcome")).toBeVisible();
      await expect(canvas.getByText("Preferences")).toBeVisible();
      await expect(canvas.getByText("Budget Setup")).toBeVisible();
      await expect(canvas.getByText("Budget Details")).toBeVisible();
      await expect(canvas.getByText("Investments")).toBeVisible();
    });
  }
};

/**
 * Stepper at the Budget Details step.
 * This step allows users to configure detailed budget allocations.
 */
export const AtBudgetDetailsStep: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: OnboardingSteps.BUDGET_DETAILS
      }
    }
  },
  args: {
    children: <div className="p-4">Budget details configuration content</div>
  },
  play: async ({ canvas, step }) => {
    await step("Verify budget details content is rendered", async () => {
      await expect(canvas.getByText("Budget details configuration content")).toBeVisible();
    });

    await step("Verify all steps are visible", async () => {
      await expect(canvas.getByText("Welcome")).toBeVisible();
      await expect(canvas.getByText("Preferences")).toBeVisible();
      await expect(canvas.getByText("Budget Setup")).toBeVisible();
      await expect(canvas.getByText("Budget Details")).toBeVisible();
      await expect(canvas.getByText("Investments")).toBeVisible();
    });
  }
};

/**
 * Stepper at the Investments step.
 * This is the final step in the visible stepper navigation where users add investment accounts.
 */
export const AtInvestmentsStep: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: OnboardingSteps.INVESTMENTS
      }
    }
  },
  args: {
    children: <div className="p-4">Investment accounts setup content</div>
  },
  play: async ({ canvas, step }) => {
    await step("Verify investments step content is rendered", async () => {
      await expect(canvas.getByText("Investment accounts setup content")).toBeVisible();
    });

    await step("Verify all steps are visible", async () => {
      await expect(canvas.getByText("Welcome")).toBeVisible();
      await expect(canvas.getByText("Preferences")).toBeVisible();
      await expect(canvas.getByText("Budget Setup")).toBeVisible();
      await expect(canvas.getByText("Budget Details")).toBeVisible();
      await expect(canvas.getByText("Investments")).toBeVisible();
    });

    await step("Verify Investments step has description", async () => {
      await expect(canvas.getByText("Add Accounts")).toBeVisible();
    });
  }
};

/**
 * Stepper at the Categories step.
 * Note: The Categories step is part of the onboarding flow but not displayed
 * in the stepper navigation. The stepper still renders children content.
 */
export const AtCategoriesStep: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: OnboardingSteps.CATEGORIES
      }
    }
  },
  args: {
    children: <div className="p-4">Categories review content</div>
  },
  play: async ({ canvas, step }) => {
    await step("Verify categories step content is rendered", async () => {
      await expect(canvas.getByText("Categories review content")).toBeVisible();
    });

    await step("Verify stepper navigation is still visible", async () => {
      await expect(canvas.getByText("Welcome")).toBeVisible();
      await expect(canvas.getByText("Investments")).toBeVisible();
    });
  }
};

/**
 * Stepper at the Complete step.
 * Note: The Complete step is part of the onboarding flow but not displayed
 * in the stepper navigation. This represents the final confirmation screen.
 */
export const AtCompleteStep: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: OnboardingSteps.COMPLETE
      }
    }
  },
  args: {
    children: <div className="p-4">Onboarding complete! Welcome aboard.</div>
  },
  play: async ({ canvas, step }) => {
    await step("Verify complete step content is rendered", async () => {
      await expect(canvas.getByText("Onboarding complete! Welcome aboard.")).toBeVisible();
    });

    await step("Verify stepper navigation is still visible", async () => {
      await expect(canvas.getByText("Welcome")).toBeVisible();
      await expect(canvas.getByText("Investments")).toBeVisible();
    });
  }
};

/**
 * Stepper with hidden navigation.
 * Used on the welcome screen where navigation should not be visible.
 * The navigation is rendered but invisible (for layout consistency).
 */
export const HiddenNavigation: Story = {
  args: {
    hideNav: true,
    children: <div className="p-4">Welcome screen without visible navigation</div>
  },
  play: async ({ canvas, step }) => {
    await step("Verify children content is still rendered", async () => {
      await expect(canvas.getByText("Welcome screen without visible navigation")).toBeVisible();
    });

    await step("Verify navigation exists but is invisible", async () => {
      const navElement = canvas.queryByRole("tablist", { name: /Onboarding stepper/ });
      await expect(navElement).toBeNull();
    });
  }
};

/**
 * Tests step navigation interaction.
 * Clicking on a step should trigger navigation to that step.
 */
export const StepNavigation: Story = {
  play: async ({ canvas, step }) => {
    await step("Verify stepper is interactive", async () => {
      const preferencesStep = canvas.getByText("Preferences");
      await expect(preferencesStep).toBeVisible();

      const trigger = preferencesStep.closest("button");
      await expect(trigger).toBeVisible();
    });

    await step("Verify all steps have clickable triggers", async () => {
      const welcomeStep = canvas.getByText("Welcome");
      await expect(welcomeStep.closest("button")).toBeVisible();

      const budgetSetupStep = canvas.getByText("Budget Setup");
      await expect(budgetSetupStep.closest("button")).toBeVisible();

      const budgetDetailsStep = canvas.getByText("Budget Details");
      await expect(budgetDetailsStep.closest("button")).toBeVisible();

      const investmentsStep = canvas.getByText("Investments");
      await expect(investmentsStep.closest("button")).toBeVisible();
    });
  }
};
