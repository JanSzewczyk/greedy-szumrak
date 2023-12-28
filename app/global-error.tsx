"use client";

import { Button } from "@szum-tech/design-system";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body>
        <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-4 py-10 md:py-20">
          <h2 className="mb-8 typography-heading-3">Something went wrong!</h2>
          <Button variant="outlined" onClick={() => reset()}>
            Try again
          </Button>
        </div>
      </body>
    </html>
  );
}
