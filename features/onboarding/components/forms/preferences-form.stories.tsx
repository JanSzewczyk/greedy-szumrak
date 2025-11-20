import { type Meta, type StoryObj } from "@storybook/react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";

import { PreferencesForm } from "./preferences-form";

const meta = {
  title: "Features/Onboarding/PreferencesForm",
  component: PreferencesForm,
  decorators: [(story) => <div className="w-full max-w-xl">{story()}</div>]
} satisfies Meta<typeof PreferencesForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default state with no default values.
 * Form fields are empty and show placeholders.
 * Validation requires both fields to be filled.
 */
export const NoDefaultValues: Story = {
  args: {
    onBackAction: fn(),
    onContinueAction: fn()
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify form structure
    await expect(canvas.getByText("Set Your Preferences")).toBeInTheDocument();
    await expect(canvas.getByText("Customize your experience")).toBeInTheDocument();

    // Verify fields exist with placeholders
    const currencySelect = canvas.getByText("Select Your Currency");
    const dateFormatSelect = canvas.getByText("Select Date Format");

    await expect(currencySelect).toBeInTheDocument();
    await expect(dateFormatSelect).toBeInTheDocument();

    // Verify buttons
    await expect(canvas.getByRole("button", { name: /back/i })).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: /continue/i })).toBeInTheDocument();
  }
};

/**
 * Validation test: Submit empty form.
 * Both fields are required and should show validation errors.
 */
export const ValidationEmptyForm: Story = {
  args: {
    onBackAction: fn(),
    onContinueAction: fn()
  },
  play: async ({ canvas, args }) => {
    // Submit without filling any field
    const continueButton = canvas.getByRole("button", { name: /continue/i });
    await userEvent.click(continueButton);

    // Wait for validation errors to appear
    await waitFor(async () => {
      const errorMessages = canvas.getAllByText(/please select/i);
      await expect(errorMessages.length).toBeGreaterThanOrEqual(2);
    });

    // Verify onContinueAction was NOT called
    await expect(args.onContinueAction).not.toHaveBeenCalled();
  }
};

/**
 * Validation test: Only currency filled.
 * Date format field should show validation error.
 */
export const ValidationPartialForm: Story = {
  args: {
    onBackAction: fn(),
    onContinueAction: fn()
  },
  play: async ({ canvas, args, canvasElement }) => {
    // Fill only currency field
    const currencyTrigger = canvas.getByLabelText("Currency");
    await userEvent.click(currencyTrigger);

    const portalElement = canvasElement.parentElement as HTMLElement;
    const portal = within(portalElement);

    // Wait for options to appear and select one
    await waitFor(async () => {
      const eurOption = portal.getByRole("option", { name: /EUR - Euro/i });
      await expect(eurOption).toBeVisible();
      await userEvent.click(eurOption);
    });

    // Submit form
    const continueButton = canvas.getByRole("button", { name: /continue/i });
    await userEvent.click(continueButton);

    // Wait for date format validation error
    await waitFor(async () => {
      const errorMessage = canvas.getByText(/please select your preferred date format/i);
      await expect(errorMessage).toBeInTheDocument();
    });

    // Verify onContinueAction was NOT called
    await expect(args.onContinueAction).not.toHaveBeenCalled();
  }
};

/**
 * Form with prefilled values.
 * All fields populated with valid data.
 */
export const PrefilledValues: Story = {
  args: {
    defaultValues: {
      currency: "PLN",
      dateFormat: "DD/MM/YYYY"
    },
    onBackAction: fn(),
    onContinueAction: fn(async () => {
      return { success: true } as never;
    })
  },
  play: async ({ canvas, args }) => {
    // Verify prefilled values are displayed
    await expect(canvas.getByLabelText(/Currency/)).toHaveTextContent("PLN - Polish Zloty");
    await expect(canvas.getByLabelText(/Date Format/)).toHaveTextContent("DD/MM/YYYY");

    // Submit form with prefilled values
    const continueButton = canvas.getByRole("button", { name: /continue/i });
    await userEvent.click(continueButton);

    // Verify onContinueAction was called with correct data
    await waitFor(async () => {
      await expect(args.onContinueAction).toHaveBeenCalledWith({
        currency: "PLN",
        dateFormat: "DD/MM/YYYY"
      });
    });
  }
};

/**
 * Test back button functionality.
 * Clicking back should trigger onBackAction.
 */
export const BackButtonAction: Story = {
  args: {
    defaultValues: {
      currency: "USD",
      dateFormat: "MM/DD/YYYY"
    },
    onBackAction: fn(),
    onContinueAction: fn()
  },
  play: async ({ canvas, args }) => {
    const backButton = canvas.getByRole("button", { name: /back/i });
    await userEvent.click(backButton);

    await expect(args.onBackAction).toHaveBeenCalledTimes(1);
  }
};

/**
 * Test error handling from server action.
 * Server returns error, toast should display error message.
 */
export const ServerErrorHandling: Story = {
  args: {
    defaultValues: {
      currency: "USD",
      dateFormat: "YYYY-MM-DD"
    },
    onBackAction: fn(() => {}),
    onContinueAction: fn(async () => ({
      success: false as const,
      error: "Failed to save preferences. Please try again."
    }))
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const continueButton = canvas.getByRole("button", { name: /continue/i });
    await userEvent.click(continueButton);

    // Verify action was called
    await waitFor(async () => {
      await expect(args.onContinueAction).toHaveBeenCalledWith({
        currency: "USD",
        dateFormat: "YYYY-MM-DD"
      });
    });

    // Note: Toast message verification would require additional Storybook setup
    // The toast.error() call is made but not easily testable in this context
  }
};

/**
 * Test loading state during submission.
 * Button should be disabled while form is submitting.
 */
export const LoadingState: Story = {
  args: {
    defaultValues: {
      currency: "EUR",
      dateFormat: "DD/MM/YYYY"
    },
    onBackAction: fn(() => {}),
    onContinueAction: fn(
      async () =>
        new Promise<never>((resolve) => {
          setTimeout(() => resolve(undefined as never), 2000);
        })
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const continueButton = canvas.getByRole("button", { name: /continue/i });
    await userEvent.click(continueButton);

    // Button should be disabled during submission
    await expect(continueButton).toBeDisabled();
  }
};
