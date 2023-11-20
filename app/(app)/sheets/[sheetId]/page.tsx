import { notFound } from "next/navigation";

import { getColumnExpenses, getSheetById, getSheetColumnsBySheetId, getUserSession } from "~/api";
import { type MonthlySheetColumnSummary } from "~/types";

import { ExpensesColumnDetails } from "./components/expenses-column-details";
import "./actions";

async function loadData({ sheetId }: { sheetId: string }) {
  const user = await getUserSession();

  const [error, sheet] = await getSheetById({ userId: user.user.id, sheetId });
  const [columnsError, columns] = await getSheetColumnsBySheetId({ userId: user.user.id, sheetId });

  if (columnsError || error) {
    return notFound();
  }

  const allExpenses = await Promise.all(
    columns.map((column) => getColumnExpenses({ userId: user.user.id, sheetId, column }))
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
      <div className="mt-10">
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {monthlyExpenses.map((column) => (
            <li key={column.id}>
              <ExpensesColumnDetails columnSummary={column} sheet={sheet} />
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
