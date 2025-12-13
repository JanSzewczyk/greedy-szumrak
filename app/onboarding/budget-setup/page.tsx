import { auth } from "@clerk/nextjs/server";
import { StepperContent } from "@szum-tech/design-system";
import { redirect } from "next/navigation";
import { getBudgetTemplates } from "~/features/budget/server/db/budget-templates";
import { BudgetSetupForm } from "~/features/onboarding/components/forms/budget-setup-form";
import { type BudgetSetupFormData } from "~/features/onboarding/schemas/budget-setup";
import { submitBudgetConfiguration } from "~/features/onboarding/server/actions/submit-budget-configuration";
import { getOnboardingById } from "~/features/onboarding/server/db/onboarding";
import { OnboardingSteps } from "~/features/onboarding/types/onboarding";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "onboarding-budget-setup-page" });

async function loadData() {
  const { userId } = await auth();

  // Proxy.ts enforces authentication, but defensive check for type safety
  if (!userId) {
    logger.error("No userId despite proxy authentication");
    redirect("/sign-in");
  }

  logger.info({ userId }, "Loading onboarding budget-setup page data");

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
    logger.error(
      {
        userId,
        errorCode: budgetTemplateError.code,
        isRetryable: budgetTemplateError.isRetryable
      },
      "Failed to load budget templates"
    );

    if (budgetTemplateError.isRetryable) {
      // Transient error - let error.tsx handle with retry UI
      throw budgetTemplateError;
    }

    throw new Error("Unable to access budget templates");
  }

  // Runtime validation of budget templates
  if (!Array.isArray(budgetTemplates) || budgetTemplates.length === 0) {
    logger.error({ userId, templateCount: budgetTemplates?.length }, "No budget templates available");
    throw new Error("No budget templates available");
  }

  const activeBudgetTemplates = budgetTemplates
    .filter((budgetTemplate) => budgetTemplate.isActive)
    .sort((a, b) => (b.isRecommended === a.isRecommended ? 0 : b.isRecommended ? 1 : -1));

  if (activeBudgetTemplates.length === 0) {
    logger.error({ userId, totalTemplates: budgetTemplates.length }, "No active budget templates available");
    throw new Error("No active budget templates available");
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
        defaultValues={onboarding.budget}
      />
    </StepperContent>
  );
}
