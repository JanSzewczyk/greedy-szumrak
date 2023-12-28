import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@szum-tech/design-system";
import { notFound } from "next/navigation";

import { getColumnExpenses, getSheetColumnById } from "~/api";
import { getUserSession } from "~/lib/auth";

async function loadData({ columnId, sheetId }: { columnId: string; sheetId: string }) {
  const { user } = await getUserSession();

  const [error, column] = await getSheetColumnById({ userId: user?.id ?? "", columnId, sheetId });
  if (error) {
    return notFound();
  }

  const [columnExpensesError, columnExpenses] = await getColumnExpenses({ userId: user?.id ?? "", sheetId, column });
  if (columnExpensesError) {
    return notFound();
  }

  // const monthlyExpenses: Array<MonthlySheetColumnSummary> = columnsExpenses.map(({ expenses, ...column }) => {
  //   const amount = expenses.reduce((acc, expense) => acc + expense.amount, 0);
  //   return {
  //     ...column,
  //     amount
  //   };
  // });

  return { column, columnExpenses };
}

export default async function SheetColumnPage({
  params: { columnId, sheetId }
}: {
  params: { columnId: string; sheetId: string };
}) {
  const { column, columnExpenses } = await loadData({ sheetId, columnId });

  console.log(columnExpenses);
  return (
    <main>
      <Card>
        <CardHeader className="flex-row">
          <div className="flex-1">
            <CardTitle>{column.name}</CardTitle>
            {column.description ? <CardDescription>{column.description}</CardDescription> : null}
          </div>

          <div>
            <Button>Edit</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <div className="text-gray-200 typography-caption">Created at:</div>
            <p className="typography-body-1">{new Date(column.createAt).toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
