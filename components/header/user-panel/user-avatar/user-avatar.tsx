import { Avatar, AvatarFallback, AvatarImage } from "@szum-tech/design-system";
import { type User } from "next-auth";

type UserAvatarProps = {
  user?: User;
};

export function UserAvatar({ user }: UserAvatarProps) {
  const shortName =
    user?.name ??
    ""
      .split(" ")
      .slice(0, 2)
      .map((name) => name[0])
      .join("");

  return (
    <Avatar>
      <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? undefined} />
      <AvatarFallback>{shortName}</AvatarFallback>
    </Avatar>
  );
}
