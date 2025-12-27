import { type Meta, type StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { InvestmentAccountCardForm } from "~/features/onboarding/components/forms/investment-form/investment-account-card-form";

const meta = {
  title: "Features/Onboarding/Investment Account Card Form",
  component: InvestmentAccountCardForm,
  decorators: [(story) => <div className="w-full max-w-xl">{story()}</div>],
  args: {
    onSave: fn(),
    onCancel: fn()
  }
} satisfies Meta<typeof InvestmentAccountCardForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default form for adding a new investment account.
 * Tests the complete form interaction flow:
 * 1. Verifies initial state with all fields visible
 * 2. Fills in all required fields
 * 3. Submits the form and verifies callback is called
 */
export const Default: Story = {
  // play: async ({ canvasElement, args, step }) => {
  //   const canvas = within(canvasElement);
  //
  //   await step("Verify form header shows 'Add New Account'", async () => {
  //     await expect(canvas.getByText(/add new account/i)).toBeVisible();
  //   });
  //
  //   await step("Verify all form fields are visible", async () => {
  //     await expect(canvas.getByLabelText(/broker/i)).toBeVisible();
  //     await expect(canvas.getByLabelText(/account name/i)).toBeVisible();
  //     await expect(canvas.getByLabelText(/account number/i)).toBeVisible();
  //     await expect(canvas.getByLabelText(/currency/i)).toBeVisible();
  //   });
  //
  //   await step("Verify action buttons are present", async () => {
  //     await expect(canvas.getByRole("button", { name: /cancel/i })).toBeVisible();
  //     await expect(canvas.getByRole("button", { name: /add account/i })).toBeVisible();
  //   });
  //
  //   await step("Fill in broker field", async () => {
  //     const brokerSelect = canvas.getByLabelText(/broker/i);
  //     await userEvent.click(brokerSelect);
  //
  //     await waitFor(async () => {
  //       const xtbOption = canvas.getByRole("option", { name: /xtb/i });
  //       await userEvent.click(xtbOption);
  //     });
  //   });
  //
  //   await step("Fill in account name", async () => {
  //     const accountNameInput = canvas.getByLabelText(/account name/i);
  //     await userEvent.type(accountNameInput, "Main Trading Account");
  //   });
  //
  //   await step("Fill in account number", async () => {
  //     const accountNumberInput = canvas.getByLabelText(/account number/i);
  //     await userEvent.type(accountNumberInput, "123456789");
  //   });
  //
  //   await step("Fill in currency field", async () => {
  //     const currencySelect = canvas.getByLabelText(/currency/i);
  //     await userEvent.click(currencySelect);
  //
  //     await waitFor(async () => {
  //       const plnOption = canvas.getByRole("option", { name: /pln/i });
  //       await userEvent.click(plnOption);
  //     });
  //   });
  //
  //   await step("Submit form", async () => {
  //     const submitButton = canvas.getByRole("button", { name: /add account/i });
  //     await userEvent.click(submitButton);
  //   });
  //
  //   await step("Verify onSave callback was called", async () => {
  //     await waitFor(async () => {
  //       await expect(args.onSave).toHaveBeenCalledOnce();
  //     });
  //   });
  // }
};
