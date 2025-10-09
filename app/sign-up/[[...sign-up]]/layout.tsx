import * as React from "react";

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return <main className="container flex flex-col items-center py-10 md:py-20">{children}</main>;
}
