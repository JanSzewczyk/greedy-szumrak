"use client";

import * as React from "react";

import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

import { type SignInOption } from "./sign-in-buttons";

type SignInItemProps = SignInOption;

export function SignInItem({ label, providerType, icon, description }: SignInItemProps) {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  return (
    <div
      role="button"
      tabIndex={0}
      className="-mx-6 flex cursor-pointer items-center px-6 py-4 hover:bg-gray-400 active:bg-gray-350 sm:px-8"
      onClick={() => signIn(providerType, { callbackUrl })}
    >
      <div className="mr-4">{React.cloneElement(icon, { className: "h-6 w-6" })}</div>
      <div>
        <div className="typography-subtitle-1">{label}</div>
        {description ? (
          <div className="typography-body-2">
            <small>{description}</small>
          </div>
        ) : null}
      </div>
    </div>
  );
}
