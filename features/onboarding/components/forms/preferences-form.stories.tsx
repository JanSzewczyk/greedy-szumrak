import preview from "~/.storybook/preview";
import { expect, fn, screen, waitFor } from "storybook/test";
import { type RedirectAction } from "~/lib/action-types";

import { PreferencesForm } from "./preferences-form";

const meta = preview.meta({
  title: "Features/Onboarding/PreferencesForm",
  component: PreferencesForm,
  decorators: [(story) => <div className="w-full max-w-xl">{story()}</div>],
  args: {
    onBackAction: fn(),
    onContinueAction: fn(
      () =>
        ({
          success: true
        }) as unknown as RedirectAction
    )
  }
});

/**
 * Default state with no default values.
 * Form fields are empty and show placeholders.
 * Validates that all UI elements are rendered correctly.
 */
export const NoDefaultValues = meta.story({
  play: async ({ canvas, step }) => {
    await step("Verify form header and description", async () => {
      await expect(canvas.getByText("Set Your Preferences")).toBeInTheDocument();
      await expect(canvas.getByText("Customize your experience")).toBeInTheDocument();
    });

    await step("Verify currency field with placeholder", async () => {
      const currencySelect = canvas.getByText("Select Your Currency");
      await expect(currencySelect).toBeInTheDocument();
    });

    await step("Verify date format field with placeholder", async () => {
      const dateFormatSelect = canvas.getByText("Select Date Format");
      await expect(dateFormatSelect).toBeInTheDocument();
    });

    await step("Verify navigation buttons", async () => {
      await expect(canvas.getByRole("button", { name: /back/i })).toBeInTheDocument();
      await expect(canvas.getByRole("button", { name: /continue/i })).toBeInTheDocument();
    });
  }
});

/**
 * Validation test: Submit empty form.
 * Both fields are required and should show validation errors.
 * Verifies onContinueAction is NOT called on invalid submission.
 */
export const ValidationEmptyForm = meta.story({
  play: async ({ canvas, userEvent, args, step }) => {
    await step("Submit form without filling any field", async () => {
      const continueButton = canvas.getByRole("button", { name: /continue/i });
      await userEvent.click(continueButton);
    });

    await step("Verify validation errors appear", async () => {
      await waitFor(async () => {
        const errorMessages = canvas.getAllByText(/please select/i);
        await expect(errorMessages.length).toBeGreaterThanOrEqual(2);
      });
    });

    await step("Verify onContinueAction was NOT called", async () => {
      await expect(args.onContinueAction).not.toHaveBeenCalled();
    });
  }
});

/**
 * Validation test: Only currency filled.
 * Date format field should show validation error.
 * Demonstrates partial form validation behavior.
 */
export const ValidationPartialForm = meta.story({
  play: async ({ canvas, userEvent, args, step }) => {
    await step("Fill only currency field", async () => {
      const currencyTrigger = canvas.getByLabelText("Currency");
      await userEvent.click(currencyTrigger);

      await waitFor(async () => {
        const eurOption = screen.getByRole("option", { name: /EUR - Euro/i });
        await expect(eurOption).toBeVisible();
        await userEvent.click(eurOption);
      });
    });

    await step("Submit form", async () => {
      const continueButton = canvas.getByRole("button", { name: /continue/i });
      await userEvent.click(continueButton);
    });

    await step("Verify date format validation error", async () => {
      await waitFor(async () => {
        const errorMessage = canvas.getByText(/please select your preferred date format/i);
        await expect(errorMessage).toBeInTheDocument();
      });
    });

    await step("Verify onContinueAction was NOT called", async () => {
      await expect(args.onContinueAction).not.toHaveBeenCalled();
    });
  }
});

/**
 * Form with prefilled values.
 * All fields populated with valid data.
 * Tests successful submission with prefilled values.
 */
export const PrefilledValues = meta.story({
  args: {
    defaultValues: {
      currency: "PLN",
      dateFormat: "DD/MM/YYYY"
    }
  },
  play: async ({ canvas, userEvent, args, step }) => {
    await step("Verify prefilled values are displayed", async () => {
      await expect(canvas.getByLabelText(/Currency/)).toHaveTextContent("PLN - Polish Zloty");
      await expect(canvas.getByLabelText(/Date Format/)).toHaveTextContent("DD/MM/YYYY");
    });

    await step("Submit form with prefilled values", async () => {
      const continueButton = canvas.getByRole("button", { name: /continue/i });
      await userEvent.click(continueButton);
    });

    await step("Verify onContinueAction was called with correct data", async () => {
      await waitFor(async () => {
        await expect(args.onContinueAction).toHaveBeenCalledWith({
          currency: "PLN",
          dateFormat: "DD/MM/YYYY"
        });
      });
    });
  }
});

/**
 * Complete user flow: Fill form and submit.
 * Tests selecting both fields and successful submission.
 */
export const CompleteUserFlow = meta.story({
  play: async ({ canvas, userEvent, args, step }) => {
    await step("Select currency", async () => {
      const currencyTrigger = canvas.getByLabelText("Currency");
      await userEvent.click(currencyTrigger);

      await waitFor(async () => {
        const usdOption = screen.getByRole("option", { name: /USD - US Dollar/i });
        await expect(usdOption).toBeVisible();
        await userEvent.click(usdOption);
      });

      await expect(currencyTrigger).toHaveTextContent("USD - US Dollar");
    });

    await step("Select date format", async () => {
      const dateFormatTrigger = canvas.getByLabelText("Date Format");
      await userEvent.click(dateFormatTrigger);

      await waitFor(async () => {
        const dateOption = screen.getByRole("option", { name: /YYYY-MM-DD/i });
        await expect(dateOption).toBeVisible();
        await userEvent.click(dateOption);
      });

      await expect(dateFormatTrigger).toHaveTextContent("YYYY-MM-DD");
    });

    await step("Submit form", async () => {
      const continueButton = canvas.getByRole("button", { name: /continue/i });
      await userEvent.click(continueButton);
    });

    await step("Verify form submission with selected values", async () => {
      await waitFor(async () => {
        await expect(args.onContinueAction).toHaveBeenCalledWith({
          currency: "USD",
          dateFormat: "YYYY-MM-DD"
        });
      });
    });
  }
});

/**
 * Test back button functionality.
 * Clicking back should trigger onBackAction callback.
 */
export const BackButtonAction = meta.story({
  args: {
    defaultValues: {
      currency: "USD",
      dateFormat: "MM/DD/YYYY"
    }
  },
  play: async ({ canvas, userEvent, args, step }) => {
    await step("Click back button", async () => {
      const backButton = canvas.getByRole("button", { name: /back/i });
      await userEvent.click(backButton);
    });

    await step("Verify onBackAction was called", async () => {
      await expect(args.onBackAction).toHaveBeenCalledOnce();
    });
  }
});

/**
 * Test error handling from server action.
 * Server returns error response, component should handle it gracefully.
 * Note: Toast message verification requires additional Storybook setup.
 */
export const ServerErrorHandling = meta.story({
  args: {
    defaultValues: {
      currency: "USD",
      dateFormat: "YYYY-MM-DD"
    },
    onContinueAction: fn(async () => ({
      success: false as const,
      error: "Failed to save preferences. Please try again."
    }))
  },
  play: async ({ canvas, userEvent, args, step }) => {
    await step("Submit form", async () => {
      const continueButton = canvas.getByRole("button", { name: /continue/i });
      await userEvent.click(continueButton);
    });

    await step("Verify onContinueAction was called with correct data", async () => {
      await waitFor(async () => {
        await expect(args.onContinueAction).toHaveBeenCalledWith({
          currency: "USD",
          dateFormat: "YYYY-MM-DD"
        });
      });
    });

    // Note: Toast notification verification would require Sonner/Toaster setup in Storybook decorators
  }
});

/**
 * Test loading state during submission.
 * Continue button should be disabled while form is submitting.
 */
export const LoadingState = meta.story({
  args: {
    defaultValues: {
      currency: "EUR",
      dateFormat: "DD/MM/YYYY"
    },
    onContinueAction: fn(
      async () =>
        new Promise((resolve) => {
          setTimeout(() => resolve({ success: true } as never), 2000);
        })
    )
  },
  play: async ({ canvas, userEvent, step }) => {
    await step("Submit form to trigger loading state", async () => {
      const continueButton = canvas.getByRole("button", { name: /continue/i });
      await userEvent.click(continueButton);
    });

    await step("Verify button is disabled during submission", async () => {
      const continueButton = canvas.getByRole("button", { name: /continue/i });
      await expect(continueButton).toBeDisabled();
    });
  }
});

/**
 * Test changing selection in dropdowns.
 * User can change their selection after initial choice.
 */
export const ChangeSelection = meta.story({
  args: {
    defaultValues: {
      currency: "USD",
      dateFormat: "MM/DD/YYYY"
    }
  },
  play: async ({ canvas, userEvent, args, step }) => {
    await step("Verify initial values", async () => {
      await expect(canvas.getByLabelText(/Currency/)).toHaveTextContent("USD - US Dollar");
      await expect(canvas.getByLabelText(/Date Format/)).toHaveTextContent("MM/DD/YYYY");
    });

    await step("Change currency from USD to EUR", async () => {
      const currencyTrigger = canvas.getByLabelText("Currency");
      await userEvent.click(currencyTrigger);

      await waitFor(async () => {
        const eurOption = screen.getByRole("option", { name: /EUR - Euro/i });
        await expect(eurOption).toBeVisible();
        await userEvent.click(eurOption);
      });

      await expect(currencyTrigger).toHaveTextContent("EUR - Euro");
    });

    await step("Change date format from MM/DD/YYYY to DD/MM/YYYY", async () => {
      const dateFormatTrigger = canvas.getByLabelText("Date Format");
      await userEvent.click(dateFormatTrigger);

      await waitFor(async () => {
        const dateOption = screen.getByRole("option", { name: /DD\/MM\/YYYY/i });
        await expect(dateOption).toBeVisible();
        await userEvent.click(dateOption);
      });

      await expect(dateFormatTrigger).toHaveTextContent("DD/MM/YYYY");
    });

    await step("Submit and verify changed values", async () => {
      const continueButton = canvas.getByRole("button", { name: /continue/i });
      await userEvent.click(continueButton);

      await waitFor(async () => {
        await expect(args.onContinueAction).toHaveBeenCalledWith({
          currency: "EUR",
          dateFormat: "DD/MM/YYYY"
        });
      });
    });
  }
});
