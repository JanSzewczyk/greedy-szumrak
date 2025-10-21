import { type NextApiRequest, type NextApiResponse } from "next";

import { getAuth } from "@clerk/nextjs/server";
import { redirect, RedirectType } from "next/navigation";
import { getOnboardingByUserId } from "~/features/onboarding/server/db/onboarding";
import { setOnboardingCookie } from "~/features/onboarding/server/services/onboarding-cookie";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "onboarding-route" });

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  logger.info("Onboarding route GET request received");

  const { userId, isAuthenticated } = getAuth(req);

  if (!isAuthenticated) {
    logger.warn("Unauthorized access attempt to onboarding route");
    return res.status(401).json({ error: "Unauthorized" });
  }

  logger.info({ userId }, "Fetching onboarding data for user");
  const [, onboardingData] = await getOnboardingByUserId(userId ?? "");

  if (onboardingData && onboardingData.id) {
    logger.info(
      { userId, onboardingId: onboardingData.id, currentStep: onboardingData.currentStep },
      "Onboarding data found, redirecting to current step"
    );
    await setOnboardingCookie(onboardingData?.id ?? "");
    return redirect(onboardingData.currentStep, RedirectType.replace);
  }

  logger.info({ userId }, "No onboarding data found, redirecting to welcome page");
  return redirect("/onboarding/welcome", RedirectType.replace);
}
