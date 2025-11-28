import { auth } from "@clerk/nextjs/server";
import { StepperContent } from "@szum-tech/design-system";
import { redirect } from "next/navigation";
import { getBudgetTemplateById } from "~/features/budget/server/db/budget-templates";
import { BudgetDetailsForm } from "~/features/onboarding/components/forms/budget-details-form";
import { type BudgetDetailsFormData } from "~/features/onboarding/schemas/budget-details";
import { submitBudgetDetails } from "~/features/onboarding/server/actions/submit-budget-details";
import { getOnboardingById } from "~/features/onboarding/server/db/onboarding";
import { OnboardingSteps } from "~/features/onboarding/types/onboarding";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "onboarding-budget-details-page" });

async function loadData() {
  const { userId } = await auth();

  // Proxy.ts enforces authentication, but defensive check for type safety
  if (!userId) {
    logger.error("No userId despite proxy authentication");
    redirect("/sign-in");
  }

  logger.info({ userId }, "Loading onboarding budget-details page data");

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

  const { preferences, budget } = onboarding;

  if (!preferences) {
    logger.warn(
      { userId, currentStep: onboarding.currentStep },
      "Preferences data required, redirecting to preferences step"
    );
    redirect(OnboardingSteps.PREFERENCES);
  }

  if (!budget) {
    logger.warn(
      { userId, currentStep: onboarding.currentStep, hasBudget: !!budget },
      "Budget configuration incomplete, redirecting to budget-setup step"
    );
    redirect(OnboardingSteps.BUDGET_SETUP);
  }

  const [budgetTemplateError, budgetTemplate] = await getBudgetTemplateById(budget.budgetProfile);
  if (budgetTemplateError) {
    logger.error(
      {
        userId,
        budgetProfile: budget.budgetProfile,
        errorCode: budgetTemplateError.code,
        isRetryable: budgetTemplateError.isRetryable
      },
      "Failed to load budget template"
    );
    throw budgetTemplateError;
  }

  logger.info(
    {
      userId,
      onboardingId: onboarding.id,
      budgetProfile: budget.budgetProfile,
      allocationCount: budgetTemplate.allocations.length
    },
    "Successfully loaded page data"
  );

  return {
    onboarding,
    budgetTemplate,
    preferences,
    budget
  };
}

export default async function BudgetDetailsPage() {
  const { onboarding, budgetTemplate, preferences, budget } = await loadData();

  async function handleBack() {
    "use server";
    redirect(OnboardingSteps.BUDGET_SETUP);
  }

  async function handleSubmitBudgetDetails(data: BudgetDetailsFormData) {
    "use server";
    return await submitBudgetDetails(data, onboarding);
  }

  return (
    <StepperContent value={OnboardingSteps.BUDGET_DETAILS}>
      <BudgetDetailsForm
        budgetTemplate={budgetTemplate}
        monthlyIncome={budget.monthlyIncome}
        onBackAction={handleBack}
        onContinueAction={handleSubmitBudgetDetails}
        preferences={preferences}
        defaultValues={onboarding?.budgetDetails}
      />
    </StepperContent>
  );
}
