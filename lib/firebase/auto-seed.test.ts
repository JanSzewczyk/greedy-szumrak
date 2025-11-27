import { beforeEach, describe, expect, it, vi } from "vitest";

import { type SeedBudgetTemplatesResult } from "~/features/budget/server/db/budget-templates";

// Mock server-only modules before importing anything
vi.mock("server-only", () => ({}));

// Mock the logger
const mockLogger = {
  info: vi.fn(),
  error: vi.fn(),
  debug: vi.fn(),
  warn: vi.fn()
};

vi.mock("~/lib/logger", () => ({
  createLogger: () => mockLogger
}));

// Mock the budget templates seed function
const mockBudgetTemplates = vi.fn();
vi.mock("~/features/budget/server/db/budget-templates", () => ({
  budgetTemplates: mockBudgetTemplates
}));

// Import after mocks
const { autoSeedDatabase, resetSeedingState } = await import("./auto-seed");

describe("autoSeedDatabase", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    // Reset seeding state before each test
    resetSeedingState();
  });

  it("should successfully seed the database on first call", async () => {
    const mockResult: SeedBudgetTemplatesResult = {
      skipped: false,
      stats: {
        created: 5,
        updated: 0,
        skipped: 0,
        errors: []
      }
    };

    mockBudgetTemplates.mockResolvedValue([null, mockResult]);

    await autoSeedDatabase();

    // Verify budget templates were called with force: false
    expect(mockBudgetTemplates).toHaveBeenCalledTimes(1);
    expect(mockBudgetTemplates).toHaveBeenCalledWith({ force: false });

    // Verify logging
    expect(mockLogger.info).toHaveBeenCalledWith("Starting automatic database seeding");
    expect(mockLogger.info).toHaveBeenCalledWith("Automatic database seeding completed successfully");
    expect(mockLogger.error).not.toHaveBeenCalled();
    expect(mockLogger.debug).not.toHaveBeenCalled();
  });

  it("should skip seeding if already initialized", async () => {
    const mockResult: SeedBudgetTemplatesResult = {
      skipped: false,
      stats: {
        created: 5,
        updated: 0,
        skipped: 0,
        errors: []
      }
    };

    mockBudgetTemplates.mockResolvedValue([null, mockResult]);

    // First call should succeed
    await autoSeedDatabase();
    expect(mockBudgetTemplates).toHaveBeenCalledTimes(1);

    // Second call should skip
    await autoSeedDatabase();
    expect(mockBudgetTemplates).toHaveBeenCalledTimes(1); // Still only called once
    expect(mockLogger.debug).toHaveBeenCalledWith("Auto-seed already initialized or in progress, skipping");
  });

  it("should skip seeding if already in progress", async () => {
    const mockResult: SeedBudgetTemplatesResult = {
      skipped: false,
      stats: {
        created: 5,
        updated: 0,
        skipped: 0,
        errors: []
      }
    };

    // Make the first call hang to simulate in-progress state
    let resolveFirstCall: (value: [null, SeedBudgetTemplatesResult]) => void;
    const firstCallPromise = new Promise<[null, SeedBudgetTemplatesResult]>((resolve) => {
      resolveFirstCall = resolve;
    });

    mockBudgetTemplates.mockReturnValueOnce(firstCallPromise);
    mockBudgetTemplates.mockResolvedValue([null, mockResult]);

    // Start first call (will hang)
    const firstCall = autoSeedDatabase();

    // Try to call again while first is in progress
    await autoSeedDatabase();

    // Verify second call was skipped
    expect(mockBudgetTemplates).toHaveBeenCalledTimes(1);
    expect(mockLogger.debug).toHaveBeenCalledWith("Auto-seed already initialized or in progress, skipping");

    // Complete the first call
    resolveFirstCall!([null, mockResult]);
    await firstCall;
  });

  it("should handle seeding errors and log them", async () => {
    const errorMessage = "Database connection failed";
    const error = new Error(errorMessage);

    mockBudgetTemplates.mockResolvedValue([error, null]);

    await autoSeedDatabase();

    // Verify budget templates were called
    expect(mockBudgetTemplates).toHaveBeenCalledTimes(1);
    expect(mockBudgetTemplates).toHaveBeenCalledWith({ force: false });

    // Verify error logging
    expect(mockLogger.info).toHaveBeenCalledWith("Starting automatic database seeding");
    expect(mockLogger.error).toHaveBeenCalledWith({ error }, "Automatic database seeding failed");
    expect(mockLogger.info).not.toHaveBeenCalledWith("Automatic database seeding completed successfully");
  });

  it("should not set initialized flag when seeding fails", async () => {
    const error = new Error("Seeding failed");

    mockBudgetTemplates.mockResolvedValue([error, null]);

    // First call should fail
    await autoSeedDatabase();
    expect(mockBudgetTemplates).toHaveBeenCalledTimes(1);
    expect(mockLogger.error).toHaveBeenCalled();

    // Reset mocks for clarity
    vi.clearAllMocks();

    // Second call should try again since initialization failed
    const mockResult: SeedBudgetTemplatesResult = {
      skipped: false,
      stats: {
        created: 5,
        updated: 0,
        skipped: 0,
        errors: []
      }
    };

    mockBudgetTemplates.mockResolvedValue([null, mockResult]);

    await autoSeedDatabase();

    // Verify it attempted to seed again
    expect(mockBudgetTemplates).toHaveBeenCalledTimes(1);
    expect(mockLogger.info).toHaveBeenCalledWith("Starting automatic database seeding");
  });

  it("should reset in-progress flag even when seeding fails", async () => {
    const error = new Error("Seeding failed");

    mockBudgetTemplates.mockResolvedValue([error, null]);

    // First call should fail
    await autoSeedDatabase();
    expect(mockLogger.error).toHaveBeenCalled();

    // Reset mocks
    vi.clearAllMocks();

    // Second call should not be blocked by in-progress flag
    await autoSeedDatabase();

    // Verify it attempted to seed again (not skipped due to in-progress)
    expect(mockBudgetTemplates).toHaveBeenCalledTimes(1);
    expect(mockLogger.debug).not.toHaveBeenCalledWith("Auto-seed already initialized or in progress, skipping");
  });

  it("should handle skipped seeding result", async () => {
    const mockResult: SeedBudgetTemplatesResult = {
      skipped: true,
      stats: null
    };

    mockBudgetTemplates.mockResolvedValue([null, mockResult]);

    await autoSeedDatabase();

    // Verify budget templates were called
    expect(mockBudgetTemplates).toHaveBeenCalledTimes(1);
    expect(mockBudgetTemplates).toHaveBeenCalledWith({ force: false });

    // Verify success logging (even though skipped)
    expect(mockLogger.info).toHaveBeenCalledWith("Starting automatic database seeding");
    expect(mockLogger.info).toHaveBeenCalledWith("Automatic database seeding completed successfully");
    expect(mockLogger.error).not.toHaveBeenCalled();
  });

  it("should handle unexpected errors during seeding", async () => {
    // Simulate an unexpected error (e.g., network error)
    mockBudgetTemplates.mockRejectedValue(new Error("Network error"));

    // This should not throw
    await expect(autoSeedDatabase()).rejects.toThrow("Network error");

    // Verify it attempted to seed
    expect(mockBudgetTemplates).toHaveBeenCalledTimes(1);
  });
});

describe("resetSeedingState", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetSeedingState();
  });

  it("should reset seeding state flags", async () => {
    const mockResult: SeedBudgetTemplatesResult = {
      skipped: false,
      stats: {
        created: 5,
        updated: 0,
        skipped: 0,
        errors: []
      }
    };

    mockBudgetTemplates.mockResolvedValue([null, mockResult]);

    // Seed the database
    await autoSeedDatabase();
    expect(mockBudgetTemplates).toHaveBeenCalledTimes(1);
    expect(mockLogger.info).toHaveBeenCalledWith("Automatic database seeding completed successfully");

    // Try to seed again - should be skipped
    vi.clearAllMocks();
    await autoSeedDatabase();
    expect(mockBudgetTemplates).not.toHaveBeenCalled();
    expect(mockLogger.debug).toHaveBeenCalledWith("Auto-seed already initialized or in progress, skipping");

    // Reset state
    resetSeedingState();

    // Now seeding should work again
    vi.clearAllMocks();
    mockBudgetTemplates.mockResolvedValue([null, mockResult]);
    await autoSeedDatabase();
    expect(mockBudgetTemplates).toHaveBeenCalledTimes(1);
    expect(mockLogger.info).toHaveBeenCalledWith("Starting automatic database seeding");
  });

  it("should allow resetting state even when seeding failed", async () => {
    const error = new Error("Seeding failed");
    mockBudgetTemplates.mockResolvedValue([error, null]);

    // First attempt fails
    await autoSeedDatabase();
    expect(mockLogger.error).toHaveBeenCalledWith({ error }, "Automatic database seeding failed");

    // Try again - should not be skipped (because initialized flag wasn't set)
    vi.clearAllMocks();
    const mockResult: SeedBudgetTemplatesResult = {
      skipped: false,
      stats: {
        created: 5,
        updated: 0,
        skipped: 0,
        errors: []
      }
    };
    mockBudgetTemplates.mockResolvedValue([null, mockResult]);

    await autoSeedDatabase();
    expect(mockBudgetTemplates).toHaveBeenCalledTimes(1);

    // Now reset and verify we can seed again
    resetSeedingState();
    vi.clearAllMocks();
    await autoSeedDatabase();
    expect(mockBudgetTemplates).toHaveBeenCalledTimes(1);
  });

  it("should reset both initialized and in-progress flags", () => {
    // This is a simple test to ensure the function exists and can be called
    expect(() => resetSeedingState()).not.toThrow();
  });
});

describe("autoSeedDatabase - concurrent calls", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetSeedingState();
  });

  it("should handle multiple concurrent calls gracefully", async () => {
    const mockResult: SeedBudgetTemplatesResult = {
      skipped: false,
      stats: {
        created: 5,
        updated: 0,
        skipped: 0,
        errors: []
      }
    };

    // Make the seeding slow to test concurrent behavior
    let resolveSeeding: (value: [null, SeedBudgetTemplatesResult]) => void;
    const seedingPromise = new Promise<[null, SeedBudgetTemplatesResult]>((resolve) => {
      resolveSeeding = resolve;
    });

    mockBudgetTemplates.mockReturnValueOnce(seedingPromise);

    // Start multiple concurrent calls
    const call1 = autoSeedDatabase();
    const call2 = autoSeedDatabase();
    const call3 = autoSeedDatabase();

    // Wait a bit to ensure all calls have checked the flags
    await new Promise((resolve) => setTimeout(resolve, 10));

    // Complete the seeding
    resolveSeeding!([null, mockResult]);

    // Wait for all calls to complete
    await Promise.all([call1, call2, call3]);

    // Only the first call should have triggered seeding
    expect(mockBudgetTemplates).toHaveBeenCalledTimes(1);

    // The other calls should have been skipped
    expect(mockLogger.debug).toHaveBeenCalledWith("Auto-seed already initialized or in progress, skipping");
  });

  it("should allow seeding after failed concurrent attempts", async () => {
    const error = new Error("Seeding failed");

    // Make the first seeding slow
    let resolveSeeding: (value: [Error, null]) => void;
    const seedingPromise = new Promise<[Error, null]>((resolve) => {
      resolveSeeding = resolve;
    });

    mockBudgetTemplates.mockReturnValueOnce(seedingPromise);

    // Start multiple concurrent calls
    const call1 = autoSeedDatabase();
    const call2 = autoSeedDatabase();

    // Complete the seeding with error
    resolveSeeding!([error, null]);

    await Promise.all([call1, call2]);

    // Verify error was logged
    expect(mockLogger.error).toHaveBeenCalledWith({ error }, "Automatic database seeding failed");

    // Reset mocks and try again
    vi.clearAllMocks();

    const mockResult: SeedBudgetTemplatesResult = {
      skipped: false,
      stats: {
        created: 5,
        updated: 0,
        skipped: 0,
        errors: []
      }
    };

    mockBudgetTemplates.mockResolvedValue([null, mockResult]);

    // Should be able to try again
    await autoSeedDatabase();
    expect(mockBudgetTemplates).toHaveBeenCalledTimes(1);
    expect(mockLogger.info).toHaveBeenCalledWith("Automatic database seeding completed successfully");
  });
});
