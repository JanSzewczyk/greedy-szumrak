import { auth } from "@clerk/nextjs/server";
import { StepperContent } from "@szum-tech/design-system";
import { notFound, redirect, unauthorized } from "next/navigation";
import { PreferencesForm } from "~/features/onboarding/components/forms/preferences-form";
import { type PreferencesFormData } from "~/features/onboarding/schemas/preferences";
import { submitPreferences } from "~/features/onboarding/server/actions/submit-preferences";
import { getOnboardingById } from "~/features/onboarding/server/db/onboarding";
import { OnboardingSteps } from "~/features/onboarding/types/onboarding";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "onboarding-preferences-page" });

async function loadData() {
  const { userId, isAuthenticated } = await auth();

  if (!isAuthenticated) {
    logger.warn("Unauthorized access attempt");
    unauthorized();
  }

  logger.info({ userId }, "Loading onboarding preferences page data");

  const [error, onboarding] = await getOnboardingById(userId);
  if (error) {
    logger.error(
      {
        userId,
        error
      },
      error.message
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

  return { onboarding };
}

export default async function PreferencesPage() {
  const { onboarding } = await loadData();

  async function handleBack() {
    "use server";
    redirect(OnboardingSteps.WELCOME);
  }

  async function handleSubmitPreferencesStep(data: PreferencesFormData) {
    "use server";
    return await submitPreferences(data, onboarding);
  }

  return (
    <StepperContent value={OnboardingSteps.PREFERENCES}>
      <PreferencesForm
        onBackAction={handleBack}
        onContinueAction={handleSubmitPreferencesStep}
        defaultValues={onboarding?.preferences}
      />
    </StepperContent>
  );
}
