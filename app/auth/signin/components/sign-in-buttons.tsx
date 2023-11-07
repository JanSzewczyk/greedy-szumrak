import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@szum-tech/design-system";
import { GoogleLogoIcon } from "@szum-tech/design-system/icons";
import { type BuiltInProviderType } from "next-auth/providers";

import { SignInItem } from "./sign-in-item";

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
      icon: <GoogleLogoIcon />,
      description: "Use your Google account to sign in."
    }
  ];

  return (
    <div className="w-full max-w-sm">
      <Card>
        <CardHeader>
          <CardTitle>Sign-in options</CardTitle>
        </CardHeader>

        <CardContent>
          <ul className="divide-y divide-gray-400">
            {signInOptions.map((option) => (
              <li key={option.providerType}>
                <SignInItem {...option} />
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
