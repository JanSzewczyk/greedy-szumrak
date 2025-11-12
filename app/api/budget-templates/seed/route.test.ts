import { beforeEach, describe, expect, it, vi } from "vitest";

import { type SeedBudgetTemplatesResult } from "~/features/budget/server/db/budget-templates";

// Mock server-only modules before importing anything
vi.mock("server-only", () => ({}));

// Mock Firebase
vi.mock("~/lib/firebase", () => ({
  db: {}
}));

// Mock the logger
vi.mock("~/lib/logger", () => ({
  createLogger: () => ({
    info: vi.fn(),
    error: vi.fn()
  })
}));

// Mock the seed function
vi.mock("~/features/budget/server/db/budget-templates", () => ({
  budgetTemplates: vi.fn()
}));

// Import after mocks
const { GET } = await import("./route");
const { budgetTemplates } = await import("~/features/budget/server/db/budget-templates");

describe("GET /api/budget-templates/seed", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should seed budget templates successfully without force flag", async () => {
    const mockResult: SeedBudgetTemplatesResult = {
      skipped: false,
      stats: {
        created: 5,
        updated: 0,
        skipped: 0,
        errors: []
      }
    };

    vi.mocked(budgetTemplates).mockResolvedValue([null, mockResult]);

    const request = new Request("http://localhost:3000/api/budget-templates/seed");
    const response = await GET(request);
    const data = await response.json();

    expect(budgetTemplates).toHaveBeenCalledWith({ force: false });
    expect(response.status).toBe(200);
    expect(data).toEqual({
      success: true,
      results: {
        budgetTemplates: mockResult
      }
    });
  });

  it("should seed budget templates successfully with force=true", async () => {
    const mockResult: SeedBudgetTemplatesResult = {
      skipped: false,
      stats: {
        created: 0,
        updated: 5,
        skipped: 0,
        errors: []
      }
    };

    vi.mocked(budgetTemplates).mockResolvedValue([null, mockResult]);

    const request = new Request("http://localhost:3000/api/budget-templates/seed?force=true");
    const response = await GET(request);
    const data = await response.json();

    expect(budgetTemplates).toHaveBeenCalledWith({ force: true });
    expect(response.status).toBe(200);
    expect(data).toEqual({
      success: true,
      results: {
        budgetTemplates: mockResult
      }
    });
  });

  it("should handle errors and return 500 status", async () => {
    const errorMessage = "Database connection failed";
    vi.mocked(budgetTemplates).mockResolvedValue([new Error(errorMessage), null]);

    const request = new Request("http://localhost:3000/api/budget-templates/seed");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      success: false,
      error: errorMessage
    });
  });

  it("should handle unknown errors", async () => {
    // Mock throwing a non-Error value (string)
    vi.mocked(budgetTemplates).mockRejectedValue("Unknown error");

    const request = new Request("http://localhost:3000/api/budget-templates/seed");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      success: false,
      error: "Unknown error occurred"
    });
  });

  it("should parse force parameter correctly when set to false", async () => {
    const mockResult: SeedBudgetTemplatesResult = {
      skipped: false,
      stats: {
        created: 5,
        updated: 0,
        skipped: 0,
        errors: []
      }
    };

    vi.mocked(budgetTemplates).mockResolvedValue([null, mockResult]);

    const request = new Request("http://localhost:3000/api/budget-templates/seed?force=false");
    await GET(request);

    expect(budgetTemplates).toHaveBeenCalledWith({ force: false });
  });

  it("should parse force parameter correctly when set to any other value", async () => {
    const mockResult: SeedBudgetTemplatesResult = {
      skipped: false,
      stats: {
        created: 5,
        updated: 0,
        skipped: 0,
        errors: []
      }
    };

    vi.mocked(budgetTemplates).mockResolvedValue([null, mockResult]);

    const request = new Request("http://localhost:3000/api/budget-templates/seed?force=yes");
    await GET(request);

    expect(budgetTemplates).toHaveBeenCalledWith({ force: false });
  });
});
