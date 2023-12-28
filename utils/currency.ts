export const currencyList = [
  {
    label: "US Dollar (USD)",
    value: "USD"
  },
  {
    label: "Euro (EUR)",
    value: "EUR"
  },
  {
    label: "Zloty (PLN)",
    value: "PLN"
  }
];

export function formatCurrency(value: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency
  }).format(value);
}
