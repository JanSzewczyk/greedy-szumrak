import React from "react";

import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@szum-tech/design-system";
import { ToastHandler } from "~/lib/toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      {children}
      <Toaster position="top-right" />
      <ToastHandler />
    </ClerkProvider>
  );
}
