import { Header as SzumHeader } from "@szum-tech/design-system";
import Link from "next/link";
import { type User } from "next-auth";

import { UserPanel } from "~/components/header/user-panel/user-panel";

type HeaderProps = {
  user?: User;
};

export function Header({ user }: HeaderProps) {
  return (
    <SzumHeader>
      <div className="flex-1">
        <Link className="typography-heading-5" href="/">
          Greedy Szumrak
        </Link>
      </div>

      <div className="flex">
        <UserPanel user={user} />
      </div>
    </SzumHeader>
  );
}
