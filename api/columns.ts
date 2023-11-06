import { addDoc, collection, serverTimestamp } from "@firebase/firestore";
import { db } from "~/lib/firebase";
import { CreateColumnFormType } from "~/schemas/column";

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
