export const BrokerId = {
  XTB: "xtb",
  MBANK: "mbank",
  REVOLUT: "revolut",
  INTERACTIVE_BROKERS: "interactive-brokers",
  DEGIRO: "degiro",
  ETORO: "etoro",
  OTHER: "other"
} as const;
export type BrokerId = (typeof BrokerId)[keyof typeof BrokerId];

export type Broker = {
  id: BrokerId;
  name: string;
  description: string;
  isPopular: boolean;
};

/**
 * Popular brokers available in Poland
 */
export const brokers: Broker[] = [
  {
    id: "xtb",
    name: "XTB",
    description: "Leading Polish broker",
    isPopular: true
  },
  {
    id: "mbank",
    name: "mBank",
    description: "mBank Brokerage",
    isPopular: true
  },
  {
    id: "revolut",
    name: "Revolut",
    description: "Revolut Trading",
    isPopular: true
  },
  {
    id: "interactive-brokers",
    name: "Interactive Brokers",
    description: "Global brokerage platform",
    isPopular: false
  },
  {
    id: "degiro",
    name: "DEGIRO",
    description: "European discount broker",
    isPopular: false
  },
  {
    id: "etoro",
    name: "eToro",
    description: "Social trading platform",
    isPopular: false
  },
  {
    id: "other",
    name: "Other Broker",
    description: "Custom broker not listed",
    isPopular: false
  }
];

export { currencyOptions as investmentCurrencyOptions } from "~/constants/currency";
