export const currencyList = [
  {
    label: "US Dollar",
    value: "USD"
  },
  {
    label: "Euro",
    value: "EUR"
  },
  {
    label: "Zloty",
    value: "PLN"
  }
];

export function formatCurrency(value: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency
  }).format(value);
}
