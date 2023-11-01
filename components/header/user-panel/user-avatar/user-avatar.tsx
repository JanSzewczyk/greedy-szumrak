import { Avatar, AvatarFallback, AvatarImage } from "@szum-tech/design-system";
import { type UserInfo } from "next-auth";

type UserAvatarProps = {
  user: UserInfo;
};

export function UserAvatar({ user }: UserAvatarProps) {
  const shortName = user.name
    .split(" ")
    .slice(0, 2)
    .map((name) => name[0])
    .join("");

  return (
    <Avatar>
      <AvatarImage src={user.image} alt={user.name} />
      <AvatarFallback>{shortName}</AvatarFallback>
    </Avatar>
  );
}
