import { auth } from "@clerk/nextjs/server";
import { StepperContent } from "@szum-tech/design-system";
import { notFound, redirect, unauthorized } from "next/navigation";
import { getBudgetTemplateById } from "~/features/budget/server/db/budget-templates";
import { BudgetDetailsForm } from "~/features/onboarding/components/forms/budget-details-form";
import { type BudgetDetailsFormData } from "~/features/onboarding/schemas/budget-details";
import { submitBudgetDetails } from "~/features/onboarding/server/actions/submit-budget-details";
import { getOnboardingById } from "~/features/onboarding/server/db/onboarding";
import { OnboardingSteps } from "~/features/onboarding/types/onboarding";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "onboarding-budget-details-page" });

async function loadData() {
  const { userId, isAuthenticated } = await auth();

  if (!isAuthenticated) {
    logger.warn("Unauthorized access attempt");
    unauthorized();
  }

  logger.info({ userId }, "Loading onboarding budget-details page data");

  const [onboardingError, onboarding] = await getOnboardingById(userId);
  if (onboardingError) {
    logger.error(
      {
        userId,
        error: onboardingError
      },
      onboardingError.message
    );
    notFound();
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
      { userId, currentStep: onboarding.currentStep },
      "Budget configuration required, redirecting to budget-setup step"
    );
    redirect(OnboardingSteps.BUDGET_SETUP);
  }

  const [budgetTemplateError, budgetTemplate] = await getBudgetTemplateById(budget.budgetProfile);
  if (budgetTemplateError) {
    logger.error({ userId, error: budgetTemplateError }, "Budget template not found");
    notFound();
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
