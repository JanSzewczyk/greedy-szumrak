import "server-only";

import { clerkClient, type User } from "@clerk/nextjs/server";
import { categorizeDbError, DbError } from "~/lib/firebase/errors";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "user-db" });
const RESOURCE_NAME = "User";

/**
 * Merge the provided fields into a Clerk user's public metadata.
 *
 * @param userId - Clerk user identifier to update
 * @param metadata - Partial public metadata to merge into the user's existing publicMetadata
 * @returns `[null, updatedUser]` on success where `updatedUser` is the updated Clerk `User`, or `[DbError, null]` on failure
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