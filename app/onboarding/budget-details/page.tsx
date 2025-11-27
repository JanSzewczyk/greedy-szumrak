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

  logger.info({ userId }, "Loading onboarding budget-details page data");

  if (!isAuthenticated) {
    logger.warn("Unauthorized access attempt");
    unauthorized();
  }

  const [onboardingError, onboarding] = await getOnboardingById(userId);
  if (onboardingError) {
    logger.error({ userId, error: onboardingError }, "Failed to fetch onboarding data");
    notFound();
  }

  const { preferences, budget } = onboarding;

  if (!preferences) {
    logger.warn({ userId }, "Preferences data required, redirect to preferences step");
    redirect(OnboardingSteps.PREFERENCES);
  }

  if (!budget) {
    logger.warn({ userId }, "Budget configuration required, redirect to budget-setup step");
    redirect(OnboardingSteps.BUDGET_SETUP);
  }

  const [budgetTemplateError, budgetTemplate] = await getBudgetTemplateById(budget.budgetProfile);
  if (budgetTemplateError) {
    logger.error(
      { userId, budgetProfile: budget.budgetProfile, error: budgetTemplateError },
      "Budget template not found"
    );
    notFound();
  }

  logger.info(
    {
      userId,
      onboardingId: onboarding.id
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
