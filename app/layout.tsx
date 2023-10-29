import * as React from "react";

import { type Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Greedy Szumrak",
  description: ""
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
