import { auth } from "@clerk/nextjs/server";
import { StepperContent } from "@szum-tech/design-system";
import { notFound, redirect } from "next/navigation";
import { getBudgetTemplates } from "~/features/budget/server/db/budget-templates";
import { SetUpBudgetsForm } from "~/features/onboarding/components/forms/set-up-budgets-form";
import { submitBudgetConfiguration } from "~/features/onboarding/server/actions/submit-budget-configuration";
import { getOnboardingById } from "~/features/onboarding/server/db/onboarding";
import { type BudgetChooseTemplateFormData } from "~/features/onboarding/shemas/set-up-budget";
import { OnboardingSteps } from "~/features/onboarding/types/onboarding";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "onboarding-set-up-budgets-page" });

async function loadData() {
  const { userId } = await auth();

  logger.info({ userId }, "Loading onboarding set-up-budgets page data");

  // Handle unauthenticated users
  if (!userId) {
    logger.warn("Unauthorized access attempt - no userId");
    redirect("/sign-in");
  }

  // Fetch onboarding data
  const [onboardingError, onboarding] = await getOnboardingById(userId);
  if (onboardingError) {
    logger.error({ userId, error: onboardingError }, "Failed to fetch onboarding data");
    notFound();
  }

  const { preferences } = onboarding;

  if (!preferences) {
    logger.warn({ userId }, "Preferences data required, redirect to preferences step");
    throw redirect(OnboardingSteps.PREFERENCES);
  }

  // Fetch budget templates
  const [budgetTemplateError, budgetTemplates] = await getBudgetTemplates();
  if (budgetTemplateError) {
    logger.error({ userId, error: budgetTemplateError }, "Failed to fetch budget templates");
    throw new Error("Failed to load budget templates. Please try again.");
  }

  logger.info(
    {
      userId,
      onboardingId: onboarding.id,
      templateCount: budgetTemplates.length
    },
    "Successfully loaded page data"
  );

  return {
    onboarding,
    budgetTemplates: budgetTemplates
      ?.filter((budgetTemplate) => budgetTemplate.isActive)
      .sort((a, b) => (b.isRecommended === a.isRecommended ? 0 : b.isRecommended ? 1 : -1)),
    preferences
  };
}

export default async function SetUpBudgetsPage() {
  const { onboarding, budgetTemplates, preferences } = await loadData();

  async function handleBack() {
    "use server";

    redirect("/onboarding/preferences");
  }

  async function handleSubmitBudgetConfiguration(data: BudgetChooseTemplateFormData) {
    "use server";

    return await submitBudgetConfiguration(data, onboarding);
  }

  return (
    <StepperContent value={OnboardingSteps.SET_UP_BUDGET}>
      <SetUpBudgetsForm
        budgetTemplates={budgetTemplates}
        onBackAction={handleBack}
        onContinueAction={handleSubmitBudgetConfiguration}
        preferences={preferences}
        defaultValues={onboarding?.budget}
      />
    </StepperContent>
  );
}
