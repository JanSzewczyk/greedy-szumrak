export const Currency = {
  PLN: "PLN",
  EUR: "EUR",
  USD: "USD",
  GBP: "GBP"
} as const;

export type CurrencyCode = (typeof Currency)[keyof typeof Currency];

// Allows known currencies + any ISO 4217 currency code string
export type Currency = CurrencyCode | (string & {});

export type CurrencyOption = {
  value: CurrencyCode;
  label: string;
};

export const currencyOptions: CurrencyOption[] = [
  { value: Currency.PLN, label: "PLN - Polish Zloty" },
  { value: Currency.EUR, label: "EUR - Euro" },
  { value: Currency.USD, label: "USD - US Dollar" },
  { value: Currency.GBP, label: "GBP - British Pound" }
];

export const currencyValues: CurrencyCode[] = Object.values(Currency);
