import * as React from "react";

import { notFound } from "next/navigation";

import { getSheetById, getSheetColumnsBySheetId, getUserSession } from "~/api";
import { AddExpenseDialog } from "~/app/(app)/sheets/[sheetId]/components/add-expense-dialog/add-expense-dialog";

async function loadData({ sheetId }: { sheetId: string }) {
  const user = await getUserSession();

  const [error, sheet] = await getSheetById({ userId: user.user.id, sheetId });
  const [columnsError, columns] = await getSheetColumnsBySheetId({ userId: user.user.id, sheetId });

  if (error || columnsError) {
    return notFound();
  }

  return { sheet, columns };
}

export default async function SheetLayout({
  children,
  params: { sheetId }
}: {
  children: React.ReactNode;
  params: { sheetId: string };
}) {
  const { sheet, columns } = await loadData({ sheetId });

  return (
    <div>
      <div className="flex flex-row justify-between px-2 py-4">
        <div>
          <h1 className="typography-heading-5">{sheet.name}</h1>
          {sheet.description ? <p className="text-gray-200 typography-body-1">{sheet.description}</p> : null}
        </div>
        <div>
          <AddExpenseDialog columns={columns} sheet={sheet} />
        </div>
      </div>
      {children}
    </div>
  );
}
