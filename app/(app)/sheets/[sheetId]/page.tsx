import { Button } from "@szum-tech/design-system";
import { notFound } from "next/navigation";

import { getSheetById, getSheetColumnsByShopId, getUserSession } from "~/api";

async function loadData({ sheetId }: { sheetId: string }) {
  const user = await getUserSession();
  const [error, sheet] = await getSheetById({ userId: user.user.id, sheetId });

  if (error) {
    return notFound();
  }

  const [columnsError, columns] = await getSheetColumnsByShopId({ userId: user.user.id, sheetId });

  if (columnsError) {
    return notFound();
  }

  return { sheet, columns };
}

export default async function SheetPage({ params: { sheetId } }: { params: { sheetId: string } }) {
  const { sheet, columns } = await loadData({ sheetId });

  return (
    <main>
      <div className="flex flex-row justify-between px-2 py-4">
        <div>
          <h1 className="typography-heading-5">{sheet.name}</h1>
          {sheet.description ? <p className="text-gray-200 typography-body-1">{sheet.description}</p> : null}
        </div>
        <div>
          <Button variant="contained">CTA</Button>
        </div>
      </div>

      <h1>Sheet page -- {sheetId}</h1>
      <pre>{JSON.stringify(columns, null, 2)}</pre>
    </main>
  );
}
