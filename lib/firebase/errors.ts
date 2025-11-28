import "server-only";

/**
 * Firestore error codes that indicate transient/retryable issues
 * These errors may succeed if retried after a short delay
 */
const RETRYABLE_ERROR_CODES = [
  "unavailable", // Firestore service temporarily unavailable
  "deadline-exceeded", // Request took too long
  "resource-exhausted", // Quota exceeded, may recover
  "aborted", // Transaction aborted, can retry
  "internal" // Internal Firestore error, sometimes transient
] as const;

/**
 * Firestore error codes that indicate the resource doesn't exist
 */
const NOT_FOUND_ERROR_CODES = ["not-found"] as const;

/**
 * Firestore error codes that indicate the resource already exists
 */
const ALREADY_EXISTS_ERROR_CODES = ["already-exists"] as const;

/**
 * Firestore error codes that indicate permission issues
 */
const PERMISSION_ERROR_CODES = ["permission-denied", "unauthenticated"] as const;

/**
 * All known Firestore error codes
 */
export type FirestoreErrorCode =
  | (typeof RETRYABLE_ERROR_CODES)[number]
  | (typeof NOT_FOUND_ERROR_CODES)[number]
  | (typeof ALREADY_EXISTS_ERROR_CODES)[number]
  | (typeof PERMISSION_ERROR_CODES)[number]
  | "invalid-argument"
  | "failed-precondition"
  | "out-of-range"
  | "cancelled"
  | "data-loss"
  | "unknown";

/**
 * Custom error class for database operations
 * Provides structured error information for better handling upstream
 */
export class DbError extends Error {
  public readonly code: FirestoreErrorCode | "validation" | "data-corruption";
  public readonly isRetryable: boolean;
  public readonly isNotFound: boolean;
  public readonly isAlreadyExists: boolean;
  public readonly isPermissionDenied: boolean;
  public readonly cause?: Error;

  constructor(
    message: string,
    options: {
      code: DbError["code"];
      isRetryable?: boolean;
      isNotFound?: boolean;
      isAlreadyExists?: boolean;
      isPermissionDenied?: boolean;
      cause?: Error;
    }
  ) {
    super(message);
    this.name = "DbError";
    this.code = options.code;
    this.isRetryable = options.isRetryable ?? false;
    this.isNotFound = options.isNotFound ?? false;
    this.isAlreadyExists = options.isAlreadyExists ?? false;
    this.isPermissionDenied = options.isPermissionDenied ?? false;
    this.cause = options.cause;

    // Maintains proper stack trace for where error was thrown (V8 engines)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DbError);
    }
  }

  /**
   * Create a "not found" error
   */
  static notFound(resource: string, cause?: Error): DbError {
    return new DbError(`${resource} not found`, {
      code: "not-found",
      isNotFound: true,
      cause
    });
  }

  /**
   * Create an "already exists" error
   */
  static alreadyExists(resource: string, cause?: Error): DbError {
    return new DbError(`${resource} already exists`, {
      code: "already-exists",
      isAlreadyExists: true,
      cause
    });
  }

  /**
   * Create a validation error (for input validation failures)
   */
  static validation(message: string): DbError {
    return new DbError(message, {
      code: "validation"
    });
  }

  /**
   * Create a data corruption error (document exists but data is invalid)
   */
  static dataCorruption(resource: string, cause?: Error): DbError {
    return new DbError(`${resource} data is corrupted or undefined`, {
      code: "data-corruption",
      cause
    });
  }
}

/**
 * Type guard to check if an error has a code property (Firestore errors)
 */
function hasErrorCode(error: unknown): error is Error & { code: string } {
  return error instanceof Error && "code" in error && typeof (error as { code: unknown }).code === "string";
}

/**
 * Categorizes any error into a structured DbError
 * Handles Firestore errors, custom errors, and unknown errors
 *
 * @param error - The error to categorize
 * @param context - Optional context string for better error messages (e.g., "Onboarding")
 * @returns A DbError instance with appropriate flags set
 */
export function categorizeDbError(error: unknown, context?: string): DbError {
  // Already a DbError - return as is
  if (error instanceof DbError) {
    return error;
  }

  // Check for Firestore error with code property
  if (hasErrorCode(error)) {
    const code = error.code as FirestoreErrorCode;
    const resourceName = context ?? "Resource";

    // Retryable errors
    if ((RETRYABLE_ERROR_CODES as readonly string[]).includes(code)) {
      return new DbError(`${resourceName} operation failed (retryable): ${error.message}`, {
        code,
        isRetryable: true,
        cause: error
      });
    }

    // Not found errors
    if ((NOT_FOUND_ERROR_CODES as readonly string[]).includes(code)) {
      return new DbError(`${resourceName} not found`, {
        code,
        isNotFound: true,
        cause: error
      });
    }

    // Already exists errors
    if ((ALREADY_EXISTS_ERROR_CODES as readonly string[]).includes(code)) {
      return new DbError(`${resourceName} already exists`, {
        code,
        isAlreadyExists: true,
        cause: error
      });
    }

    // Permission errors
    if ((PERMISSION_ERROR_CODES as readonly string[]).includes(code)) {
      return new DbError(`${resourceName} access denied: ${error.message}`, {
        code,
        isPermissionDenied: true,
        cause: error
      });
    }

    // Other known Firestore errors
    return new DbError(`${resourceName} database error: ${error.message}`, {
      code,
      cause: error
    });
  }

  // Handle standard Error with "not found" in message (our custom throws)
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (message.includes("not found")) {
      return DbError.notFound(context ?? "Resource", error);
    }

    if (message.includes("already exists")) {
      return DbError.alreadyExists(context ?? "Resource", error);
    }

    if (message.includes("undefined") || message.includes("corrupted")) {
      return DbError.dataCorruption(context ?? "Resource", error);
    }

    // Generic error
    return new DbError(error.message, {
      code: "unknown",
      cause: error
    });
  }

  // Unknown error type
  return new DbError(context ? `${context} operation failed` : "Unknown database error", {
    code: "unknown"
  });
}
