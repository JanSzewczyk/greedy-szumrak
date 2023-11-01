import { authOptions } from "~/lib/auth";
import { getServerSession } from "next-auth";

export async function getUserSession() {
  const userSession = await getServerSession(authOptions);

  if (!userSession) {
    throw new Error("User session not found");
  }

  return userSession;
}
