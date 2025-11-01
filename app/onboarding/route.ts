import { getAuth } from "@clerk/nextjs/server";
import { redirect, RedirectType } from "next/navigation";
import { type NextRequest } from "next/server";
import { getOnboardingById } from "~/features/onboarding/server/db/onboarding";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "onboarding-route" });

export async function GET(request: NextRequest) {
  logger.info("Onboarding route GET request received");

  const { userId, isAuthenticated } = getAuth(request);

  if (!isAuthenticated) {
    logger.warn("Unauthorized access attempt to onboarding route");
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  logger.info({ userId }, "Fetching onboarding data for user");
  const [, onboardingData] = await getOnboardingById(userId ?? "");

  if (onboardingData) {
    logger.info(
      { userId, onboardingId: onboardingData.id, currentStep: onboardingData.currentStep },
      "Onboarding data found, redirecting to current step"
    );
    return redirect(onboardingData.currentStep, RedirectType.replace);
  }

  logger.info({ userId }, "No onboarding data found, redirecting to welcome page");
  return redirect("/onboarding/welcome", RedirectType.replace);
}
