import { addDoc, collection, getDocs, query, type QueryConstraint, serverTimestamp, where } from "@firebase/firestore";

import { type SheetColumn } from "~/api/columns";
import { db } from "~/lib/firebase";
import { type ExpenseFormType } from "~/schemas/expense";

export type Expense = {
  id: string;
  title: string;
  description: string | null;
  date: string;
  amount: number;
  createAt: string;
  columnId: string;
};

export async function getColumnExpenses({
  userId,
  sheetId,
  column
}: {
  userId: string;
  sheetId: string;
  column: SheetColumn;
}): Promise<[null, SheetColumn] | [Error, null]> {
  try {
    const date = new Date();
    const [error, expenses] = await getExpensesByColumnId({ userId, sheetId, columnId: column.id }, [
      where("date", ">=", `${date.getFullYear()}-${date.getMonth() + 1}-01`),
      where("date", "<", new Date(date.getFullYear(), date.getMonth() + 2, 0).toISOString().split("T")[0])
    ]);

    if (error) {
      throw new Error();
    }

    return [null, { ...column, expenses }];
  } catch (error) {
    return [new Error("Unknown error"), null];
  }
}

export async function getExpensesByColumnId(
  {
    userId,
    sheetId,
    columnId
  }: {
    userId: string;
    sheetId: string;
    columnId: string;
  },
  queryConstraints: QueryConstraint[] = []
): Promise<[null, Array<Expense>] | [Error, null]> {
  try {
    const expenseDocs = await getDocs(
      query(collection(db, "spaces", userId, "sheets", sheetId, "columns", columnId, "expenses"), ...queryConstraints)
    );

    const expenses = expenseDocs.docs.map((expenseDoc) => ({
      ...expenseDoc.data(),
      createAt: expenseDoc.data()?.createAt.toDate().toISOString(),
      id: expenseDoc.id,
      columnId
    })) as Array<Expense>;

    return [null, expenses];
  } catch (error) {
    return [new Error("Unknown error"), null];
  }
}

export async function createExpense({
  userId,
  sheetId,
  createExpense: { columnId, ...createColumn }
}: {
  userId: string;
  sheetId: string;
  createExpense: ExpenseFormType;
}): Promise<[null, string] | [Error, null]> {
  const newExpense = {
    ...createColumn,
    description: createColumn.description ?? null,
    createAt: serverTimestamp()
  };

  try {
    const expenseDoc = await addDoc(
      collection(db, "spaces", userId, "sheets", sheetId, "columns", columnId, "expenses"),
      newExpense
    );
    return [null, expenseDoc.id];
  } catch (error) {
    return [new Error("Unknown error"), null];
  }
}
