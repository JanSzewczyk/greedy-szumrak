import * as React from "react";

import { SignedIn, UserButton } from "@clerk/nextjs";
import logger from "~/lib/logger";

export default function Home() {
  logger.info("Home page loaded");

  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-between gap-16 px-4 py-10 sm:px-12 sm:py-24">
      <header>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
    </main>
  );
}
