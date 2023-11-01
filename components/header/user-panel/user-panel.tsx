"use client";

import { DashboardIcon, ExitIcon } from "@radix-ui/react-icons";
import { Separator, Sheet, SheetClose, SheetContent, SheetTrigger } from "@szum-tech/design-system";
import Link from "next/link";
import { type UserInfo } from "next-auth";

import { UserAvatar } from "~/components/header/user-panel/user-avatar/user-avatar";


type UserPanelProps = {
  user: UserInfo;
};

export function UserPanel({ user }: UserPanelProps) {
  return (
    <Sheet>
      <SheetTrigger>
        <UserAvatar user={user} />
      </SheetTrigger>

      <SheetContent>
        <div className="mb-8 flex flex-row items-center">
          <div>
            <UserAvatar user={user} />
          </div>
          <div className="ml-4">
            <div className="typography-subtitle-2 sm:typography-subtitle-1">{user.name}</div>
            <div className="text-gray-200 typography-caption sm:typography-body-2">{user.email}</div>
          </div>
        </div>

        <nav className="flex flex-col">
          <SheetClose asChild>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded px-4 py-2 hover:bg-gray-400 active:bg-primary-400/40"
            >
              <DashboardIcon className="h-4 w-4" />
              Dashboard
            </Link>
          </SheetClose>

          <div className="-mx-2">
            <Separator className="my-2" />
          </div>

          <SheetClose asChild>
            <Link
              href="/api/auth/signout"
              className="inline-flex items-center gap-2 rounded px-4 py-2 hover:bg-gray-400"
            >
              <ExitIcon className="h-4 w-4" />
              Sign Out
            </Link>
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
