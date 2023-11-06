import { db } from "~/lib/firebase";
import { addDoc, collection, DocumentData, getDocs, serverTimestamp } from "@firebase/firestore";
import { CreateSheetFormType } from "~/schemas/sheet";

export async function getTables({ userId }: { userId: string }): Promise<[null, DocumentData[]] | [Error]> {
  try {
    const tableDocs = await getDocs(collection(db, "spaces", userId, "tables"));
    const userTables = tableDocs.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    const tables = [];

    for (const table of userTables) {
      const columns = await getDocs(collection(db, "spaces", userId, "tables", table.id, "columns"));

      tables.push({
        ...table,
        columns: columns.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      });
    }
    return [null, tables];
  } catch (error) {
    return [new Error("Unknown error")];
  }
}

export type Sheet = {
  id: string;
  name: string;
  description: string | null;
  createAt: string;
};

export async function createSheet({
  userId,
  createSheet
}: {
  userId: string;
  createSheet: CreateSheetFormType;
}): Promise<[null, string] | [Error, null]> {
  const newSheet = {
    ...createSheet,
    description: createSheet.description ?? null,
    createAt: serverTimestamp()
  };

  try {
    const sheetDoc = await addDoc(collection(db, "spaces", userId, "sheets"), newSheet);
    return [null, sheetDoc.id];
  } catch (error) {
    return [new Error("Unknown error"), null];
  }
}
