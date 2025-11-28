import { auth } from "@clerk/nextjs/server";
import { StepperContent } from "@szum-tech/design-system";
import { redirect } from "next/navigation";
import { PreferencesForm } from "~/features/onboarding/components/forms/preferences-form";
import { type PreferencesFormData } from "~/features/onboarding/schemas/preferences";
import { submitPreferences } from "~/features/onboarding/server/actions/submit-preferences";
import { getOnboardingById } from "~/features/onboarding/server/db/onboarding";
import { OnboardingSteps } from "~/features/onboarding/types/onboarding";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "onboarding-preferences-page" });

async function loadData() {
  const { userId } = await auth();

  // Proxy.ts enforces authentication, but defensive check for type safety
  if (!userId) {
    logger.error("No userId despite proxy authentication");
    redirect("/sign-in");
  }

  logger.info({ userId }, "Loading onboarding preferences page data");

  const [error, onboarding] = await getOnboardingById(userId);
  if (error) {
    logger.error(
      {
        userId,
        errorCode: error.code,
        isRetryable: error.isRetryable
      },
      "Failed to load onboarding data"
    );

    if (error.isNotFound) {
      redirect(OnboardingSteps.WELCOME);
    }

    if (error.isRetryable) {
      // Transient error - let error.tsx handle with retry UI
      throw error;
    }

    throw new Error("Unable to access onboarding data");
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
