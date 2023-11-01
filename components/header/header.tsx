"use client";

import { Header as SzumHeader } from "@szum-tech/design-system";
import Link from "next/link";
import { type UserInfo } from "next-auth";

import { UserPanel } from "~/components/header/user-panel/user-panel";

type HeaderProps = {
  user: UserInfo;
};

export function Header({ user }: HeaderProps) {
  console.log(user);

  return (
    <SzumHeader>
      <div className="flex-1">
        <Link href="/">Greedy Szumrak</Link>
      </div>

      <div className="flex">
        <UserPanel user={user} />
      </div>
    </SzumHeader>
  );
}
