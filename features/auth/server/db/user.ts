import "server-only";

import { clerkClient, type User } from "@clerk/nextjs/server";
import { categorizeDbError, DbError } from "~/lib/firebase/errors";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "user-db" });
const RESOURCE_NAME = "User";

/**
 * Updates Clerk user public metadata
 *
 * @param userId - The Clerk user ID
 * @param metadata - The metadata object to merge with existing public metadata
 * @returns Tuple of [error, null] or [null, updated metadata]
 */
export async function updateUserMetadata(
  userId: string,
  metadata: Partial<UserPublicMetadata>
): Promise<[null, User] | [DbError, null]> {
  // Input validation
  if (!userId || userId.trim() === "") {
    const error = DbError.validation("Invalid userId provided");
    logger.warn({ userId, errorCode: error.code }, "Invalid userId provided for metadata update");
    return [error, null];
  }

  if (!metadata || typeof metadata !== "object" || Object.keys(metadata).length === 0) {
    const error = DbError.validation("Invalid or empty metadata provided");
    logger.warn({ userId, errorCode: error.code }, "Invalid metadata for update");
    return [error, null];
  }

  try {
    logger.info({ userId, metadata }, "Updating Clerk user metadata");

    const client = await clerkClient();
    const updatedUser = await client.users.updateUser(userId, {
      publicMetadata: metadata
    });

    logger.info({ userId }, "Clerk user metadata updated successfully");
    return [null, updatedUser];
  } catch (error) {
    // Categorize Clerk API errors as database errors
    // Clerk errors may have different structure than Firestore, but categorizeDbError handles this
    const dbError = categorizeDbError(error, RESOURCE_NAME);
    logger.error(
      {
        userId,
        errorCode: dbError.code,
        isRetryable: dbError.isRetryable
      },
      "Error updating Clerk user metadata"
    );
    return [dbError, null];
  }
}
