import { Button } from "@szum-tech/design-system";
import { PlusIcon } from "@szum-tech/design-system/icons";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getSheets, getUserSession } from "~/api";

import { SheetCard } from "./components/sheet-card";

async function loadData() {
  const user = await getUserSession();
  const [error, sheets = []] = await getSheets({ userId: user.user.id });

  if (error) {
    return notFound();
  }

  return { sheets };
}

export default async function Home() {
  const { sheets } = await loadData();

  return (
    <main className="mb-10">
      <div className="flex flex-row justify-between px-2 py-4">
        <h1 className="typography-heading-5">Dashboard</h1>
        <div>
          <Button variant="contained" endIcon={<PlusIcon />} asChild>
            <Link href="/table/new">Create new table</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {sheets.map((sheet) => (
          <SheetCard key={sheet.id} sheet={sheet} />
        ))}
      </div>
    </main>
  );
}
