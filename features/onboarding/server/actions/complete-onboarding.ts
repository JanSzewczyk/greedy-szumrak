"use server";

import { FieldValue } from "firebase-admin/firestore";
import { redirect } from "next/navigation";
import { updateUserMetadata } from "~/features/auth/server/db/user";
import { updateOnboarding } from "~/features/onboarding/server/db/onboarding";
import { type Onboarding, type UpdateOnboardingDto } from "~/features/onboarding/types/onboarding";
import { type RedirectAction } from "~/lib/action-types";
import { createLogger } from "~/lib/logger";
import { setToastCookie } from "~/lib/toast/server/toast.cookie";

const logger = createLogger({ module: "onboarding-actions" });

/**
 * Server action to complete the onboarding process
 * Marks onboarding as completed in Firestore and updates Clerk user metadata
 * Redirects to the home page after completion
 */
export async function completeOnboarding(onboarding: Onboarding): RedirectAction {
  logger.info({ onboardingId: onboarding.id }, "Completing onboarding");

  // Update onboarding document in Firestore
  const updateData: UpdateOnboardingDto = {
    completed: true,
    completedAt: FieldValue.serverTimestamp()
  };

  const [error] = await updateOnboarding(onboarding.id, updateData);
  if (error) {
    logger.error(
      {
        onboardingId: onboarding.id,
        errorCode: error.code,
        isRetryable: error.isRetryable
      },
      "Failed to mark onboarding as completed"
    );
    return { success: false, error: error.message };
  }

  logger.info({ onboardingId: onboarding.id }, "Onboarding marked as completed in database");

  // Update Clerk user metadata to mark onboarding as complete
  const [metadataError] = await updateUserMetadata(onboarding.id, { onboardingComplete: true });
  if (metadataError) {
    logger.error(
      {
        userId: onboarding.id,
        errorCode: metadataError.code,
        isRetryable: metadataError.isRetryable
      },
      "Failed to update Clerk user metadata"
    );
    return { success: false, error: "Failed to update user session" };
  }
  logger.info({ userId: onboarding.id }, "Clerk user metadata updated with onboardingComplete flag");

  logger.info({ userId: onboarding.id }, "Onboarding completed successfully, redirecting to home");

  await setToastCookie("Welcome! Your account is now set up.", "success");
  return redirect("/");
}
