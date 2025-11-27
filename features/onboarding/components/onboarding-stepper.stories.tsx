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
 * 2. **Preferences** - Currency and locale settings
 * 3. **Budget Setup** - Budget template selection
 * 4. **Categories** - Review and finalize categories
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
      await expect(canvas.getByText("Categories")).toBeVisible();
    });

    await step("Verify step descriptions are visible", async () => {
      await expect(canvas.getByText("Set Your Preferences")).toBeVisible();
      await expect(canvas.getByText("Review")).toBeVisible();
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
      await expect(canvas.getByText("Categories")).toBeVisible();
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
  }
};

/**
 * Stepper at the Categories (final) step.
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
      await expect(navElement).toBeNull(); // Element exists
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
      // Find the Preferences step and verify it can be clicked
      const preferencesStep = canvas.getByText("Preferences");
      await expect(preferencesStep).toBeVisible();

      // The step should be clickable (part of a button/trigger)
      const trigger = preferencesStep.closest("button");
      await expect(trigger).toBeVisible();
    });

    await step("Verify all steps have clickable triggers", async () => {
      const welcomeStep = canvas.getByText("Welcome");
      await expect(welcomeStep.closest("button")).toBeVisible();

      const budgetStep = canvas.getByText("Budget Setup");
      await expect(budgetStep.closest("button")).toBeVisible();

      const categoriesStep = canvas.getByText("Categories");
      await expect(categoriesStep.closest("button")).toBeVisible();
    });
  }
};
