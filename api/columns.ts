import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  type QueryConstraint,
  serverTimestamp
} from "@firebase/firestore";

import { type Expense } from "~/api/expenses";
import { db } from "~/lib/firebase";
import { type CreateColumnFormType } from "~/schemas/column";

export type SheetColumn = {
  id: string;
  name: string;
  description: string | null;
  createAt: string;
  orderIndex: number;
  sheetId: string;
  expenses: Array<Expense>;
};

export async function getSheetColumnById({
  userId,
  sheetId,
  columnId
}: {
  userId: string;
  sheetId: string;
  columnId: string;
}): Promise<[null, SheetColumn] | [Error, null]> {
  try {
    const columnDoc = await getDoc(doc(db, "spaces", userId, "sheets", sheetId, "columns", columnId));
    const column = {
      ...columnDoc.data(),
      id: columnDoc.id,
      createAt: columnDoc.data()?.createAt.toDate().toISOString(),
      sheetId,
      expenses: []
    } as unknown as SheetColumn;

    return [null, column];
  } catch (error) {
    return [new Error("Unknown error"), null];
  }
}

export async function getSheetColumnsBySheetId(
  {
    userId,
    sheetId
  }: {
    userId: string;
    sheetId: string;
  },
  queryConstraints: QueryConstraint[] = []
): Promise<[null, Array<SheetColumn>] | [Error, null]> {
  try {
    const columnsDoc = await getDocs(
      query(collection(db, "spaces", userId, "sheets", sheetId, "columns"), orderBy("orderIndex"), ...queryConstraints)
    );
    const columns = columnsDoc.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      createAt: doc.data().createAt.toDate().toISOString(),
      sheetId,
      expenses: []
    })) as unknown as Array<SheetColumn>;

    return [null, columns];
  } catch (error) {
    return [new Error("Unknown error"), null];
  }
}

export async function createSheetColumn({
  userId,
  sheetId,
  createColumn
}: {
  userId: string;
  sheetId: string;
  createColumn: CreateColumnFormType;
}): Promise<[null, string] | [Error, null]> {
  const newColumn = {
    ...createColumn,
    description: createColumn.description ?? null,
    createAt: serverTimestamp()
  };

  try {
    const columnDoc = await addDoc(collection(db, "spaces", userId, "sheets", sheetId, "columns"), newColumn);
    return [null, columnDoc.id];
  } catch (error) {
    return [new Error("Unknown error"), null];
  }
}
