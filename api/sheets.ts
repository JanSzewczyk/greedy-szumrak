import { addDoc, collection, doc, type DocumentData, getDoc, getDocs, serverTimestamp } from "@firebase/firestore";

import { db } from "~/lib/firebase";
import { type CreateSheetFormType } from "~/schemas/sheet";

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
  currency: string;
};

export async function getSheets({ userId }: { userId: string }): Promise<[null, Array<Sheet>] | [Error]> {
  try {
    const tableDocs = await getDocs(collection(db, "spaces", userId, "sheets"));
    const tables = tableDocs.docs.map((tableDoc) => ({
      ...tableDoc.data(),
      id: tableDoc.id,
      createAt: tableDoc.data()?.createAt.toDate().toISOString()
    })) as Array<Sheet>;

    return [null, tables];
  } catch (error) {
    return [new Error("Unknown error")];
  }
}

export async function getSheetById({
  userId,
  sheetId
}: {
  userId: string;
  sheetId: string;
}): Promise<[null, Sheet] | [Error, null]> {
  try {
    const sheetDoc = await getDoc(doc(db, "spaces", userId, "sheets", sheetId));

    const sheet = {
      ...sheetDoc.data(),
      createAt: sheetDoc.data()?.createAt.toDate().toISOString(),
      id: sheetDoc.id
    } as Sheet;

    return [null, sheet];
  } catch (error) {
    return [new Error("Unknown error"), null];
  }
}

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
