import * as React from "react";

export default function IntroductionLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-4 py-10 md:py-20">
      {children}
    </div>
  );
}
