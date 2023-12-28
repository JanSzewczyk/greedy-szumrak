import { type Metadata } from "next";

import { Hero } from "./components/hero";
import { SignInButtons } from "./components/sign-in-buttons";

export const metadata: Metadata = {
  title: "Greedy Szumrak - Sign in"
};

export default function SignInPage({ searchParams }: { searchParams: { callbackUrl?: string } }) {
  return (
    <main className="justify-center py-16">
      <div className="mb-16 md:mb-24">
        <h1 className="text-center typography-heading-3">Greedy Szumrak</h1>
        <div className="text-center text-gray-300 typography-overline">
          by <strong>Szum-Tech</strong>
        </div>
      </div>

      <div className="flex flex-col-reverse items-center justify-center gap-8 md:flex-row">
        <Hero />
        <SignInButtons callbackUrl={searchParams?.callbackUrl} />
      </div>
    </main>
  );
}
