import { auth } from "@clerk/nextjs/server";
import { StepperContent } from "@szum-tech/design-system";
import { notFound, redirect, unauthorized } from "next/navigation";
import { getBudgetTemplates } from "~/features/budget/server/db/budget-templates";
import { BudgetSetupForm } from "~/features/onboarding/components/forms/budget-setup-form";
import { type BudgetSetupFormData } from "~/features/onboarding/schemas/budget-setup";
import { submitBudgetConfiguration } from "~/features/onboarding/server/actions/submit-budget-configuration";
import { getOnboardingById } from "~/features/onboarding/server/db/onboarding";
import { OnboardingSteps } from "~/features/onboarding/types/onboarding";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "onboarding-budget-setup-page" });

async function loadData() {
  const { userId, isAuthenticated } = await auth();

  if (!isAuthenticated) {
    logger.warn("Unauthorized access attempt - no userId");
    unauthorized();
  }

  logger.info({ userId }, "Loading onboarding budget-setup page data");

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

  const { preferences } = onboarding;
  if (!preferences) {
    logger.warn(
      { userId, currentStep: onboarding.currentStep },
      "Preferences data required, redirecting to preferences step"
    );
    redirect(OnboardingSteps.PREFERENCES);
  }

  const [budgetTemplateError, budgetTemplates] = await getBudgetTemplates();
  if (budgetTemplateError) {
    logger.error({ userId, error: budgetTemplateError }, budgetTemplateError.message);
    notFound();
  }

  // Runtime validation of budget templates
  if (!Array.isArray(budgetTemplates) || budgetTemplates.length === 0) {
    logger.error({ userId, templateCount: budgetTemplates?.length }, "No budget templates available");
    notFound();
  }

  const activeBudgetTemplates = budgetTemplates
    .filter((budgetTemplate) => budgetTemplate.isActive)
    .sort((a, b) => (b.isRecommended === a.isRecommended ? 0 : b.isRecommended ? 1 : -1));

  if (activeBudgetTemplates.length === 0) {
    logger.error({ userId, totalTemplates: budgetTemplates.length }, "No active budget templates available");
    notFound();
  }

  logger.info(
    {
      userId,
      onboardingId: onboarding.id,
      totalTemplates: budgetTemplates.length,
      activeTemplates: activeBudgetTemplates.length
    },
    "Successfully loaded page data"
  );

  return {
    onboarding,
    budgetTemplates: activeBudgetTemplates,
    preferences
  };
}

export default async function BudgetSetupPage() {
  const { onboarding, budgetTemplates, preferences } = await loadData();

  async function handleBack() {
    "use server";
    redirect(OnboardingSteps.PREFERENCES);
  }

  async function handleSubmitBudgetConfiguration(data: BudgetSetupFormData) {
    "use server";
    return await submitBudgetConfiguration(data, onboarding);
  }

  return (
    <StepperContent value={OnboardingSteps.BUDGET_SETUP}>
      <BudgetSetupForm
        budgetTemplates={budgetTemplates}
        onBackAction={handleBack}
        onContinueAction={handleSubmitBudgetConfiguration}
        preferences={preferences}
        defaultValues={onboarding?.budget}
      />
    </StepperContent>
  );
}
