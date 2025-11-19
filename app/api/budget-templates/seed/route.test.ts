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
vi.mock("~/features/budget/server/db/budget-templates", () => ({
  budgetTemplates: vi.fn()
}));

// Import after mocks
const { GET } = await import("./route");
const { budgetTemplates } = await import("~/features/budget/server/db/budget-templates");

// Helper to create request with IP headers
function createRequest(url: string, ip = "127.0.0.1"): Request {
  const request = new Request(url);
  // Mock the headers
  Object.defineProperty(request, "headers", {
    value: new Headers({
      "x-forwarded-for": ip
    })
  });
  return request;
}

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

    const request = createRequest("http://localhost:3000/api/budget-templates/seed", "10.0.0.1");
    const response = await GET(request);
    const data = await response.json();

    expect(budgetTemplates).toHaveBeenCalledWith({ force: false });
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

    vi.mocked(budgetTemplates).mockResolvedValue([null, mockResult]);

    const request = createRequest("http://localhost:3000/api/budget-templates/seed?force=true", "10.0.0.2");
    const response = await GET(request);
    const data = await response.json();

    expect(budgetTemplates).toHaveBeenCalledWith({ force: true });
    expect(response.status).toBe(200);
    expect(data).toEqual({
      success: true,
      data: {
        budgetTemplates: mockResult
      },
      message: "Budget templates force-seeded successfully"
    });
  });

  it("should handle errors and return 500 status", async () => {
    const errorMessage = "Database connection failed";
    vi.mocked(budgetTemplates).mockResolvedValue([new Error(errorMessage), null]);

    const request = createRequest("http://localhost:3000/api/budget-templates/seed", "10.0.0.3");
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

    const request = createRequest("http://localhost:3000/api/budget-templates/seed", "10.0.0.4");
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

    const request = createRequest("http://localhost:3000/api/budget-templates/seed?force=false", "10.0.0.5");
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

    const request = createRequest("http://localhost:3000/api/budget-templates/seed?force=yes", "10.0.0.6");
    await GET(request);

    expect(budgetTemplates).toHaveBeenCalledWith({ force: false });
  });

  describe("Rate Limiting", () => {
    it("should allow up to 3 requests within 1 minute from same IP", async () => {
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

      // Make 3 requests from same IP - all should succeed
      for (let i = 0; i < 3; i++) {
        const request = createRequest("http://localhost:3000/api/budget-templates/seed", "192.168.1.1");
        const response = await GET(request);
        expect(response.status).toBe(200);
      }
    });

    it("should rate limit after 3 requests from same IP", async () => {
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

      // Make 3 successful requests
      for (let i = 0; i < 3; i++) {
        const request = createRequest("http://localhost:3000/api/budget-templates/seed", "192.168.1.2");
        await GET(request);
      }

      // 4th request should be rate limited
      const request = createRequest("http://localhost:3000/api/budget-templates/seed", "192.168.1.2");
      const response = await GET(request);
      const data = await response.json() as { success: boolean; error?: string };

      expect(response.status).toBe(429);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Rate limit exceeded");
      expect(response.headers.get("Retry-After")).toBeTruthy();
    });

    it("should not rate limit different IPs", async () => {
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

      // Make requests from different IPs - all should succeed
      const ips = ["192.168.1.10", "192.168.1.11", "192.168.1.12", "192.168.1.13"];

      for (const ip of ips) {
        const request = createRequest("http://localhost:3000/api/budget-templates/seed", ip);
        const response = await GET(request);
        expect(response.status).toBe(200);
      }
    });

    it("should handle missing IP header gracefully", async () => {
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

      // Create request without IP header
      const request = new Request("http://localhost:3000/api/budget-templates/seed");
      const response = await GET(request);

      expect(response.status).toBe(200);
    });
  });
});
