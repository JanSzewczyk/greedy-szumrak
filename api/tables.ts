import { db } from "~/lib/firebase";
import { addDoc, collection, DocumentData, getDocs, serverTimestamp } from "@firebase/firestore";

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

export type CreateTableDto = {
  name: string;
  description: string;
  columns: Array<{
    name: string;
    description: string;
    orderIndex: number;
  }>;
};

export async function createTable({
  userId,
  createTable
}: {
  userId: string;
  createTable: CreateTableDto;
}): Promise<[null, DocumentData] | [Error]> {
  try {
    const table = await addDoc(collection(db, "spaces", userId, "tables"), {
      name: createTable.name,
      description: createTable.description,
      createAt: serverTimestamp()
    });

    for (const column of createTable.columns) {
      await addDoc(collection(db, "spaces", userId, "tables", table.id, "columns"), {
        name: column.name,
        description: column.description,
        orderIndex: column.orderIndex,
        createAt: serverTimestamp()
      });
    }

    return [null, table];
  } catch (error) {
    return [new Error("Unknown error")];
  }
}
