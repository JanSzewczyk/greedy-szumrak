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

  logger.info({ userId }, "Loading onboarding preferences page data");

  // Handle unauthenticated users
  if (!isAuthenticated) {
    logger.warn("Unauthorized access attempt");
    throw unauthorized();
  }

  const [error, onboarding] = await getOnboardingById(userId);
  if (error) {
    logger.error({ userId, error }, "Failed to fetch onboarding data");
    throw notFound();
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

    redirect("/onboarding/welcome");
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
