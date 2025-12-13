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
    error: vi.fn(),
    warn: vi.fn()
  })
}));

// Mock the seed function
const mockSeedBudgetTemplates = vi.fn();
vi.mock("~/features/budget/server/db/budget-templates", () => ({
  seedBudgetTemplates: mockSeedBudgetTemplates
}));

// Import after mocks
const { GET } = await import("./route");

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

    mockSeedBudgetTemplates.mockResolvedValue([null, mockResult]);

    const request = new Request("http://localhost:3000/api/budget-templates/seed");
    const response = await GET(request);
    const data = await response.json();

    expect(mockSeedBudgetTemplates).toHaveBeenCalledWith({ force: false });
    expect(response.status).toBe(200);
    expect(data).toEqual({
      success: true,
      data: {
        budgetTemplates: mockResult
      },
      message: "Budget templates seeded successfully"
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

    mockSeedBudgetTemplates.mockResolvedValue([null, mockResult]);

    const request = new Request("http://localhost:3000/api/budget-templates/seed?force=true");
    const response = await GET(request);
    const data = await response.json();

    expect(mockSeedBudgetTemplates).toHaveBeenCalledWith({ force: true });
    expect(response.status).toBe(200);
    expect(data).toEqual({
      success: true,
      data: {
        budgetTemplates: mockResult
      },
      message: "Budget templates force-seeded successfully"
    });
  });

  it("should handle errors from budgetTemplates function", async () => {
    const errorMessage = "Database connection failed";
    mockSeedBudgetTemplates.mockResolvedValue([new Error(errorMessage), null]);

    const request = new Request("http://localhost:3000/api/budget-templates/seed");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      success: false,
      error: errorMessage
    });
  });

  it("should handle unexpected exceptions", async () => {
    // Mock throwing a non-Error value (string)
    mockSeedBudgetTemplates.mockRejectedValue("Unknown error");

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

    mockSeedBudgetTemplates.mockResolvedValue([null, mockResult]);

    const request = new Request("http://localhost:3000/api/budget-templates/seed?force=false");
    await GET(request);

    expect(mockSeedBudgetTemplates).toHaveBeenCalledWith({ force: false });
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

    mockSeedBudgetTemplates.mockResolvedValue([null, mockResult]);

    const request = new Request("http://localhost:3000/api/budget-templates/seed?force=yes");
    await GET(request);

    expect(mockSeedBudgetTemplates).toHaveBeenCalledWith({ force: false });
  });

  it("should handle skipped seeding result", async () => {
    const mockResult: SeedBudgetTemplatesResult = {
      skipped: true,
      stats: null
    };

    mockSeedBudgetTemplates.mockResolvedValue([null, mockResult]);

    const request = new Request("http://localhost:3000/api/budget-templates/seed");
    const response = await GET(request);
    const data = await response.json();

    expect(mockSeedBudgetTemplates).toHaveBeenCalledWith({ force: false });
    expect(response.status).toBe(200);
    expect(data).toEqual({
      success: true,
      data: {
        budgetTemplates: mockResult
      },
      message: "Budget templates seeded successfully"
    });
  });
});
