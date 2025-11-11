import { auth } from "@clerk/nextjs/server";
import { StepperContent } from "@szum-tech/design-system";
import { notFound, redirect } from "next/navigation";
import { PreferencesForm } from "~/features/onboarding/components/forms/preferences-form";
import { type PreferencesFormData } from "~/features/onboarding/schema";
import { submitPreferencesStep } from "~/features/onboarding/server/actions/onboarding";
import { getOnboardingById } from "~/features/onboarding/server/db/onboarding";
import { OnboardingSteps } from "~/features/onboarding/types/onboarding";
import logger from "~/lib/logger";

async function loadData() {
  const { userId } = await auth();

  logger.info("Onboarding preferences step loaded");

  const [error, onboarding] = await getOnboardingById(userId ?? "");
  if (error) {
    notFound();
  }

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

    return await submitPreferencesStep(data, onboarding);
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
