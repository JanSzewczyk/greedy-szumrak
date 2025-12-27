import { type Currency } from "~/constants/currency";

export type FormatMoneyOptions = {
  /**
   * The currency code (ISO 4217)
   * @default "USD"
   */
  currency?: Currency;
  /**
   * The locale to use for formatting
   * If not provided, auto-detects from browser/system locale
   * @default undefined (auto-detect)
   */
  locale?: string;
  /**
   * Number of decimal places to show
   * @default 2
   */
  decimals?: number;
  /**
   * Whether to show the currency symbol
   * @default true
   */
  showSymbol?: boolean;
};

/**
 * Gets the user's locale from the browser or system
 * Falls back to "en-US" if detection fails
 */
function getDefaultLocale(): string {
  if (typeof navigator !== "undefined") {
    // Browser environment - use navigator.language
    return navigator.language || "en-US";
  }
  // Server environment - use Intl default or fallback
  return Intl.DateTimeFormat().resolvedOptions().locale || "en-US";
}

/**
 * Formats a number as money with currency symbol and locale-specific formatting
 *
 * @param amount - The amount to format
 * @param options - Formatting options
 * @returns Formatted money string
 *
 * @example
 * ```ts
 * formatMoney(1234.56) // "$1,234.56" (auto-detects locale)
 * formatMoney(1234.56, { currency: "EUR" }) // "€1,234.56"
 * formatMoney(1234.56, { currency: "PLN", locale: "pl-PL" }) // "1 234,56 zł"
 * formatMoney(1234.56, { showSymbol: false }) // "1,234.56"
 * formatMoney(1234.56, { decimals: 0 }) // "$1,235"
 * ```
 */
export function formatMoney(amount: number, options: FormatMoneyOptions = {}): string {
  const { currency = "USD", locale = getDefaultLocale(), decimals = 2, showSymbol = true } = options;

  const formatter = new Intl.NumberFormat(locale, {
    style: showSymbol ? "currency" : "decimal",
    currency: showSymbol ? currency : undefined,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });

  return formatter.format(amount);
}
