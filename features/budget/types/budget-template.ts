import { type IconName } from "lucide-react/dynamic";
import { type WithDates } from "~/lib/firebase/types";

export type BudgetProfileType = "young_professional" | "family" | "aggressive_saver" | "student" | "custom";

export type BudgetTemplateBase = {
  id: BudgetProfileType;
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
  id: string;
  name: string;
  description?: string;
  icon: IconName;
  color: string;
  percentage: number;
  order: number;
  examples?: string[];
};

export type BudgetTemplate = WithDates<BudgetTemplateBase>;
