"use client"; // Error components must be Client Components

import { useEffect } from "react";

import { Button } from "@szum-tech/design-system";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-4 py-10 md:py-20">
      <h2 className="typography-heading-5">Something went wrong!</h2>
      <p className="mb-8 text-gray-200 typography-body-1">Sorry fot that :(</p>
      <Button variant="outlined" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
