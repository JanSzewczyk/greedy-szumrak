import "next-auth";

declare module "next-auth" {
  type UserInfo = {
    id: string;
    name: string;
    email?: string;
    image?: string;
  };
  interface Session {
    user: UserInfo;
    exp: string;
  }
}
