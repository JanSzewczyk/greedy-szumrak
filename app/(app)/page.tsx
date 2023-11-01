import { getTables, getUserSession } from "~/api";

async function loadData() {
  const user = await getUserSession();
  const [_error, tables = []] = await getTables({ userId: user.user.id });
  console.log(tables[0].createAt.toDate().toLocaleDateString());

  return { tables };
}

export default async function Home() {
  await loadData();
  return <main className="">DASHBOARD PAGE</main>;
}
