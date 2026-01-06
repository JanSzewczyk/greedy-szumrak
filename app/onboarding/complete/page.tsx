import { auth } from "@clerk/nextjs/server";
import { StepperContent } from "@szum-tech/design-system";
import { redirect } from "next/navigation";
import { getBudgetTemplateById } from "~/features/budget/server/db/budget-templates";
import { FinalSummary } from "~/features/onboarding/components/final-summary";
import { completeOnboarding } from "~/features/onboarding/server/actions/complete-onboarding";
import { getOnboardingById } from "~/features/onboarding/server/db/onboarding";
import { OnboardingSteps } from "~/features/onboarding/types/onboarding";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "onboarding-complete-page" });

async function loadData() {
  const { userId } = await auth();

  if (!userId) {
    logger.error("No userId despite proxy authentication");
    redirect("/sign-in");
  }

  logger.info({ userId }, "Loading onboarding complete page data");

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
      throw onboardingError;
    }

    throw new Error("Unable to access onboarding data");
  }

  const { preferences, budget, budgetDetails, products } = onboarding;

  // Ensure previous steps are completed
  if (!preferences) {
    logger.warn(
      { userId, currentStep: onboarding.currentStep },
      "Preferences data required, redirecting to preferences step"
    );
    redirect(OnboardingSteps.PREFERENCES);
  }

  if (products.budget && !budget) {
    logger.warn(
      { userId, currentStep: onboarding.currentStep },
      "Budget configuration required, redirecting to budget-setup step"
    );
    redirect(OnboardingSteps.BUDGET_SETUP);
  }

  if (products.budget && !budgetDetails) {
    logger.warn(
      { userId, currentStep: onboarding.currentStep },
      "Budget details required, redirecting to budget-details step"
    );
    redirect(OnboardingSteps.BUDGET_DETAILS);
  }

  // Investments step is validated by checking currentStep (investments step sets it to COMPLETE)
  if (onboarding.currentStep !== OnboardingSteps.COMPLETE) {
    logger.warn(
      { userId, currentStep: onboarding.currentStep },
      "User has not reached complete step yet, redirecting to current step"
    );
    redirect(onboarding.currentStep);
  }

  // Load budget template if budget was configured
  let budgetTemplate = null;
  if (budget?.budgetProfile) {
    const [budgetTemplateError, template] = await getBudgetTemplateById(budget.budgetProfile);
    if (budgetTemplateError) {
      logger.warn(
        {
          userId,
          budgetProfile: budget.budgetProfile,
          errorCode: budgetTemplateError.code
        },
        "Failed to load budget template for summary display"
      );
      // Non-critical error - continue without template info
    } else {
      budgetTemplate = template;
    }
  }

  logger.info(
    {
      userId,
      onboardingId: onboarding.id,
      hasBudget: !!budgetDetails,
      hasInvestments: onboarding.investments.length > 0,
      investmentCount: onboarding.investments.length
    },
    "Successfully loaded complete page data"
  );

  return {
    onboarding,
    budgetTemplate
  };
}

export default async function OnboardingCompletePage() {
  const { onboarding, budgetTemplate } = await loadData();

  async function handleBack() {
    "use server";
    redirect(OnboardingSteps.INVESTMENTS);
  }

  async function handleComplete() {
    "use server";
    return await completeOnboarding(onboarding);
  }

  return (
    <StepperContent value={OnboardingSteps.COMPLETE}>
      <FinalSummary
        onboarding={onboarding}
        budgetTemplate={budgetTemplate}
        onBackAction={handleBack}
        onCompleteAction={handleComplete}
      />
    </StepperContent>
  );
}
