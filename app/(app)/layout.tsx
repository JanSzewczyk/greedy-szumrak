import * as React from "react";

import { getUserSession } from "~/api";
import { Header } from "~/components/header/header";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = await getUserSession();

  return (
    <div className="relative flex min-h-screen flex-col">
      <Header user={user} />
      <div className="flex-1">
        <div className="container">{children}</div>
      </div>
    </div>
  );
}
