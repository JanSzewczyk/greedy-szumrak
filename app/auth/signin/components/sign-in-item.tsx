import * as React from "react";

import { type SignInOption } from "./sign-in-buttons";

type SignInItemProps = SignInOption;

export function SignInItem({ label, providerType, icon, description }: SignInItemProps) {
  return (
    <div className="-mx-6">
      <button
        type="submit"
        name="providerType"
        value={providerType}
        className="flex w-full cursor-pointer items-center px-6 py-4 hover:bg-gray-400 active:bg-gray-350 sm:px-8"
      >
        <div className="mr-4">{React.cloneElement(icon, { className: "h-6 w-6" })}</div>
        <div className="text-left">
          <div className="typography-subtitle-1">{label}</div>
          {description ? (
            <div className="typography-body-2">
              <small>{description}</small>
            </div>
          ) : null}
        </div>
      </button>
    </div>
  );
}
