import { type NextApiRequest, type NextApiResponse } from "next";

import { getAuth } from "@clerk/nextjs/server";
import { redirect, RedirectType } from "next/navigation";
import { getOnboardingByUserId } from "~/features/onboarding/server/db/onboarding";
import { setOnboardingCookie } from "~/features/onboarding/server/services/onboarding-cookie";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { userId, isAuthenticated } = getAuth(req);

  if (!isAuthenticated) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const [, onboardingData] = await getOnboardingByUserId(userId ?? "");

  if (onboardingData && onboardingData.id) {
    await setOnboardingCookie(onboardingData?.id ?? "");
    return redirect(onboardingData.currentStep, RedirectType.replace);
  }

  return redirect("/onboarding/welcome", RedirectType.replace);
}
