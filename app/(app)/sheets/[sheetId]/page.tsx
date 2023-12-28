import Link from "next/link";
import { notFound } from "next/navigation";

import { getColumnExpenses, getSheetById, getSheetColumnsBySheetId } from "~/api";
import { getUserSession } from "~/lib/auth";
import { type MonthlySheetColumnSummary } from "~/types";

import { ExpensesColumnDetails } from "./components/expenses-column-details";

async function loadData({ sheetId }: { sheetId: string }) {
  const { user } = await getUserSession();

  const [error, sheet] = await getSheetById({ userId: user?.id ?? "", sheetId });
  const [columnsError, columns] = await getSheetColumnsBySheetId({ userId: user?.id ?? "", sheetId });

  if (columnsError || error) {
    return notFound();
  }

  const allExpenses = await Promise.all(
    columns.map((column) => getColumnExpenses({ userId: user?.id ?? "", sheetId, column }))
  );

  const columnsExpenses = allExpenses.map((column) => {
    const [error, columnExpenses] = column;
    if (error) {
      return notFound();
    }
    return columnExpenses;
  });

  const monthlyExpenses: Array<MonthlySheetColumnSummary> = columnsExpenses.map(({ expenses, ...column }) => {
    const amount = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    return {
      ...column,
      amount
    };
  });

  return { monthlyExpenses, sheet };
}

export default async function SheetPage({ params: { sheetId } }: { params: { sheetId: string } }) {
  const { monthlyExpenses, sheet } = await loadData({ sheetId });

  return (
    <main>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {monthlyExpenses.map((column) => (
          <li key={column.id}>
            <Link href={`/sheets/${column.sheetId}/columns/${column.id}`}>
              <ExpensesColumnDetails columnSummary={column} sheet={sheet} />
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
