import { formatMoney } from "./format-money";

describe("formatMoney", () => {
  describe("basic formatting", () => {
    test("should format a positive number with default options (USD)", () => {
      const result = formatMoney(1234.56, { locale: "en-US" });
      expect(result).toBe("$1,234.56");
    });

    test("should format a negative number", () => {
      const result = formatMoney(-1234.56, { locale: "en-US" });
      expect(result).toBe("-$1,234.56");
    });

    test("should format zero", () => {
      const result = formatMoney(0, { locale: "en-US" });
      expect(result).toBe("$0.00");
    });

    test("should format very large numbers", () => {
      const result = formatMoney(1234567890.12, { locale: "en-US" });
      expect(result).toBe("$1,234,567,890.12");
    });

    test("should format very small numbers", () => {
      const result = formatMoney(0.01, { locale: "en-US" });
      expect(result).toBe("$0.01");
    });
  });

  describe("currency formatting", () => {
    test("should format USD currency", () => {
      const result = formatMoney(1234.56, { currency: "USD", locale: "en-US" });
      expect(result).toBe("$1,234.56");
    });

    test("should format EUR currency", () => {
      const result = formatMoney(1234.56, { currency: "EUR", locale: "en-US" });
      expect(result).toBe("€1,234.56");
    });

    test("should format PLN currency with Polish locale", () => {
      const result = formatMoney(1234.56, { currency: "PLN", locale: "pl-PL" });
      expect(result).toBe("1234,56\u00A0zł"); // \u00A0 is non-breaking space
    });

    test("should format EUR currency with German locale", () => {
      const result = formatMoney(1234.56, { currency: "EUR", locale: "de-DE" });
      expect(result).toBe("1.234,56\u00A0€"); // \u00A0 is non-breaking space
    });
  });

  describe("locale formatting", () => {
    test("should format with US locale", () => {
      const result = formatMoney(1234.56, { locale: "en-US", currency: "USD" });
      expect(result).toBe("$1,234.56");
    });

    test("should format with Polish locale", () => {
      const result = formatMoney(1234.56, { locale: "pl-PL", currency: "PLN" });
      expect(result).toBe("1234,56\u00A0zł"); // \u00A0 is non-breaking space
    });

    test("should format with French locale", () => {
      const result = formatMoney(1234.56, { locale: "fr-FR", currency: "EUR" });
      expect(result).toContain("1");
      expect(result).toContain("234");
      expect(result).toContain("56");
    });

    test("should format with Japanese locale", () => {
      const result = formatMoney(1234.56, { locale: "ja-JP", currency: "USD" });
      expect(result).toContain("1,234.56");
    });
  });

  describe("decimal places", () => {
    test("should format with 0 decimals", () => {
      const result = formatMoney(1234.56, { decimals: 0, locale: "en-US" });
      expect(result).toBe("$1,235");
    });

    test("should format with 1 decimal", () => {
      const result = formatMoney(1234.56, { decimals: 1, locale: "en-US" });
      expect(result).toBe("$1,234.6");
    });

    test("should format with 2 decimals (default)", () => {
      const result = formatMoney(1234.56, { decimals: 2, locale: "en-US" });
      expect(result).toBe("$1,234.56");
    });

    test("should format with 3 decimals", () => {
      const result = formatMoney(1234.567, { decimals: 3, locale: "en-US" });
      expect(result).toBe("$1,234.567");
    });

    test("should pad with zeros when needed", () => {
      const result = formatMoney(1234.5, { decimals: 2, locale: "en-US" });
      expect(result).toBe("$1,234.50");
    });
  });

  describe("symbol visibility", () => {
    test("should show currency symbol by default", () => {
      const result = formatMoney(1234.56, { locale: "en-US" });
      expect(result).toContain("$");
    });

    test("should hide currency symbol when showSymbol is false", () => {
      const result = formatMoney(1234.56, { showSymbol: false, locale: "en-US" });
      expect(result).toBe("1,234.56");
      expect(result).not.toContain("$");
    });

    test("should hide currency symbol for PLN", () => {
      const result = formatMoney(1234.56, { currency: "PLN", showSymbol: false, locale: "pl-PL" });
      expect(result).not.toContain("zł");
    });

    test("should hide currency symbol for EUR", () => {
      const result = formatMoney(1234.56, { currency: "EUR", showSymbol: false, locale: "en-US" });
      expect(result).toBe("1,234.56");
      expect(result).not.toContain("€");
    });
  });

  describe("combined options", () => {
    test("should handle EUR with German locale and 0 decimals", () => {
      const result = formatMoney(1234.56, {
        currency: "EUR",
        locale: "de-DE",
        decimals: 0
      });
      expect(result).toBe("1.235\u00A0€"); // \u00A0 is non-breaking space
    });

    test("should handle PLN without symbol and 1 decimal", () => {
      const result = formatMoney(1234.56, {
        currency: "PLN",
        locale: "pl-PL",
        showSymbol: false,
        decimals: 1
      });
      expect(result).toBe("1234,6");
    });

    test("should handle USD with French locale and 3 decimals", () => {
      const result = formatMoney(1234.567, {
        currency: "USD",
        locale: "fr-FR",
        decimals: 3
      });
      expect(result).toContain("1");
      expect(result).toContain("234");
      expect(result).toContain("567");
    });
  });

  describe("edge cases", () => {
    test("should handle undefined options", () => {
      const result = formatMoney(1234.56);
      expect(result).toMatch(/1[,\s]?234[.,]56/);
    });

    test("should handle empty options object", () => {
      const result = formatMoney(1234.56, {});
      expect(result).toMatch(/1[,\s]?234[.,]56/);
    });

    test("should handle partial options", () => {
      const result = formatMoney(1234.56, { currency: "EUR" });
      expect(result).toContain("1");
      expect(result).toContain("234");
      expect(result).toContain("56");
    });

    test("should handle Number.MAX_SAFE_INTEGER", () => {
      const result = formatMoney(Number.MAX_SAFE_INTEGER, { locale: "en-US" });
      expect(result).toContain("9,007,199,254,740,991");
    });

    test("should handle floating point precision", () => {
      const result = formatMoney(0.1 + 0.2, { locale: "en-US" });
      expect(result).toBe("$0.30");
    });
  });

  describe("locale auto-detection", () => {
    afterEach(() => {
      vi.unstubAllGlobals();
    });

    test("should use navigator.language in browser environment", () => {
      vi.stubGlobal("navigator", { language: "fr-FR" });

      const result = formatMoney(1234.56, { currency: "EUR" });

      // French locale uses different formatting
      expect(result).toContain("1");
      expect(result).toContain("234");
    });

    test("should fallback to Intl when navigator is undefined", () => {
      vi.stubGlobal("navigator", undefined);

      const result = formatMoney(1234.56);

      // Should still format correctly with system default
      expect(result).toMatch(/1[,\s]?234[.,]56/);
    });

    test("should use explicit locale over auto-detection", () => {
      vi.stubGlobal("navigator", { language: "fr-FR" });

      const result = formatMoney(1234.56, { locale: "en-US" });

      // Should use explicit en-US, not detected fr-FR
      expect(result).toBe("$1,234.56");
    });
  });

  describe("rounding behavior", () => {
    test("should round half up for 0 decimals", () => {
      expect(formatMoney(1234.5, { decimals: 0, locale: "en-US" })).toBe("$1,235");
      expect(formatMoney(1234.4, { decimals: 0, locale: "en-US" })).toBe("$1,234");
    });

    test("should round correctly for 1 decimal", () => {
      expect(formatMoney(1234.56, { decimals: 1, locale: "en-US" })).toBe("$1,234.6");
      expect(formatMoney(1234.54, { decimals: 1, locale: "en-US" })).toBe("$1,234.5");
    });

    test("should handle rounding edge cases", () => {
      expect(formatMoney(0.005, { decimals: 2, locale: "en-US" })).toBe("$0.01");
      expect(formatMoney(0.004, { decimals: 2, locale: "en-US" })).toBe("$0.00");
    });
  });
});
