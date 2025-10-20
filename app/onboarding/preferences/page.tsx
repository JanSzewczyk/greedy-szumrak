import { Button, StepperContent } from "@szum-tech/design-system";
import Link from "next/link";
import { getOnboardingCookie } from "~/features/onboarding/server/services/onboarding-cookie";
import { OnboardingSteps } from "~/features/onboarding/types/onboarding";
import logger from "~/lib/logger";

export default async function PreferencesPage() {
  const { onboardingId } = await getOnboardingCookie();

  logger.info("Performance step loaded");

  return (
    <StepperContent value={OnboardingSteps.PREFERENCES}>
      Preferences Page
      <Button asChild>
        <Link href="/onboarding/goals">Next</Link>
      </Button>
    </StepperContent>
  );
}
