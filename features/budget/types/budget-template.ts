import { type IconName } from "lucide-react/dynamic";
import { type WithDates } from "~/lib/firebase/types";

export const BudgetProfile = {
  YOUNG_PROFESSIONAL: "young_professional",
  FAMILY: "family",
  AGGRESSIVE_SAVER: "aggressive_saver",
  STUDENT: "student",
  CUSTOM: "custom"
};
export type BudgetProfile = (typeof BudgetProfile)[keyof typeof BudgetProfile];

export type BudgetTemplateBase = {
  id: BudgetProfile;
  name: string;
  description: string;
  icon: IconName;
  targetIncome: {
    min: number;
    max: number;
  };
  characteristics: string[];
  allocations: TemplateAllocation[];
  totalPercentage: number;
  isActive: boolean;
  isRecommended: boolean;
};

export type TemplateAllocation = {
  type: "needs" | "wants" | "savings";
  percentage: number;
  label: string;
  categories: BudgetCategoryTemplate[];
};

export type BudgetCategoryTemplate = {
  name: string;
  description?: string;
  icon: IconName;
  color: string;
  percentage: number;
  order: number;
  examples?: string[];
};

export type BudgetTemplate = WithDates<BudgetTemplateBase>;
