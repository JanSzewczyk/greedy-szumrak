import { Button } from "@szum-tech/design-system";
import { PlusIcon } from "@szum-tech/design-system/icons";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getTables, getUserSession } from "~/api";

async function loadData() {
  const user = await getUserSession();
  const [error, tables = []] = await getTables({ userId: user.user.id });

  if (error) {
    return notFound();
  }

  return { tables };
}

export default async function Home() {
  await loadData();

  return (
    <main className="">
      <div className="flex flex-row justify-between p-4">
        <h1 className="typography-heading-5">Dashboard</h1>
        <div>
          <Button variant="contained" endIcon={<PlusIcon />} asChild>
            <Link href="/table/new">Create new table</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
