"use server";

import { notFound, redirect } from "next/navigation";

import { createSheetColumn, getUserSession } from "~/api";
import { ROUTES } from "~/constants/routes";

import { type SheetColumnsSchemaFormType } from "./components/create-sheet-columns-card";

export async function createColumnsAction(sheetId: string, data: SheetColumnsSchemaFormType) {
  const { user } = await getUserSession();

  const newColumns = data.columns.map((column, index) => ({ ...column, orderIndex: index }));

  for (const createColumn of newColumns) {
    const [error] = await createSheetColumn({ userId: user.id, sheetId, createColumn });

    if (error) {
      return notFound();
    }
  }

  redirect(ROUTES.INTRODUCTION.FINAL(sheetId));
}
