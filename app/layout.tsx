import * as React from "react";

import { type Metadata } from "next";

import { Providers } from "~/components/providers";
import { autoSeedDatabase } from "~/lib/firebase/auto-seed";
import { createLogger } from "~/lib/logger";

import "./globals.css";

const logger = createLogger({ module: "app-layout" });

export const metadata: Metadata = {
  title: "Greedy Szumrak",
  description: ""
};

// Auto-seed database on application startup
// This runs once when the application starts
autoSeedDatabase().catch((error) => {
  logger.error({ error }, "Failed to auto-seed database");
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
