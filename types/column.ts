import { type SheetColumn } from "~/api";

export type MonthlySheetColumnSummary = Omit<SheetColumn, "expenses"> & {
  amount: number;
};
