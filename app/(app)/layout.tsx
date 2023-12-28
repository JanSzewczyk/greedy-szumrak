import * as React from "react";

import { Header } from "~/components/header/header";
import { getUserSession } from "~/lib/auth";

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
