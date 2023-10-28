import * as React from "react";

import { GoogleIcon } from "@szum-tech/design-system/icons";
import { type BuiltInProviderType } from "next-auth/providers";

import { SignInItem } from "~/app/auth/signin/components/sign-in-item";
import { Card } from "~/components/card";

export type SignInOption = {
  label: string;
  providerType: BuiltInProviderType;
  icon: React.ReactElement;
  description?: string;
};

export function SignInButtons() {
  const signInOptions: Array<SignInOption> = [
    {
      label: "Sign in with Google",
      providerType: "google",
      icon: <GoogleIcon />,
      description: "Use your Google account to sign in."
    }
  ];

  return (
    <div className="mx-auto w-full max-w-sm">
      <Card>
        <h3 className="mb-6 text-center typography-heading-5 md:text-left">Sign-in options</h3>

        <ul className="divide-y divide-gray-400">
          {signInOptions.map((option) => (
            <li key={option.providerType}>
              <SignInItem {...option} />
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
