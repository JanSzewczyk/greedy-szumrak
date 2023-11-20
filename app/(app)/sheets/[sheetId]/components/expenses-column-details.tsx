import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@szum-tech/design-system";

import { type Sheet } from "~/api";
import { type MonthlySheetColumnSummary } from "~/types";
import { formatCurrency } from "~/utils/currency";

export function ExpensesColumnDetails({
  columnSummary,
  sheet
}: {
  columnSummary: MonthlySheetColumnSummary;
  sheet: Sheet;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{columnSummary.name}</CardTitle>
        {columnSummary.description ? <CardDescription>{columnSummary.description}</CardDescription> : null}
      </CardHeader>
      <CardContent>{formatCurrency(columnSummary.amount, sheet.currency)}</CardContent>
    </Card>
  );
}
