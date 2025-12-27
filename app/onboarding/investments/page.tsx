import { auth } from "@clerk/nextjs/server";
import { StepperContent } from "@szum-tech/design-system";
import { redirect } from "next/navigation";
import { InvestmentSetupForm } from "~/features/onboarding/components/forms/investment-form/investment-setup-form";
import { skipInvestments, submitInvestments } from "~/features/onboarding/server/actions/submit-investments";
import { getOnboardingById } from "~/features/onboarding/server/db/onboarding";
import { type OnboardingInvestments, OnboardingSteps } from "~/features/onboarding/types/onboarding";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "onboarding-investments-page" });

async function loadData() {
  const { userId } = await auth();

  // Proxy.ts enforces authentication, but defensive check for type safety
  if (!userId) {
    logger.error("No userId despite proxy authentication");
    redirect("/sign-in");
  }

  logger.info({ userId }, "Loading onboarding investments page data");

  const [onboardingError, onboarding] = await getOnboardingById(userId);
  if (onboardingError) {
    logger.error(
      {
        userId,
        errorCode: onboardingError.code,
        isRetryable: onboardingError.isRetryable
      },
      "Failed to load onboarding data"
    );

    if (onboardingError.isNotFound) {
      redirect(OnboardingSteps.WELCOME);
    }

    if (onboardingError.isRetryable) {
      // Transient error - let error.tsx handle with retry UI
      throw onboardingError;
    }

    throw new Error("Unable to access onboarding data");
  }

  const { preferences, budget, budgetDetails } = onboarding;

  // Ensure previous steps are completed
  if (!preferences) {
    logger.warn(
      { userId, currentStep: onboarding.currentStep },
      "Preferences data required, redirecting to preferences step"
    );
    redirect(OnboardingSteps.PREFERENCES);
  }

  if (!budget) {
    logger.warn(
      { userId, currentStep: onboarding.currentStep },
      "Budget configuration required, redirecting to budget-setup step"
    );
    redirect(OnboardingSteps.BUDGET_SETUP);
  }

  if (!budgetDetails) {
    logger.warn(
      { userId, currentStep: onboarding.currentStep },
      "Budget details required, redirecting to budget-details step"
    );
    redirect(OnboardingSteps.BUDGET_DETAILS);
  }

  logger.info(
    {
      userId,
      onboardingId: onboarding.id,
      hasExistingInvestments: !!onboarding.investments
    },
    "Successfully loaded page data"
  );

  return {
    onboarding
  };
}

export default async function InvestmentsPage() {
  const { onboarding } = await loadData();

  async function handleBack() {
    "use server";
    redirect(OnboardingSteps.BUDGET_DETAILS);
  }

  async function handleSubmitInvestments(data: OnboardingInvestments) {
    "use server";
    return await submitInvestments(data, onboarding);
  }

  async function handleSkipInvestments() {
    "use server";
    return await skipInvestments(onboarding);
  }

  return (
    <StepperContent value={OnboardingSteps.INVESTMENTS}>
      <InvestmentSetupForm
        onBackAction={handleBack}
        // onContinueAction={handleSubmitInvestments}
        onSkipAction={handleSkipInvestments}
        initialAccounts={onboarding.investments}
      />
    </StepperContent>
  );
}
