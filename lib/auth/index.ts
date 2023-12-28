import { FirestoreAdapter } from "@auth/firebase-adapter";
import { cert } from "firebase-admin/app";
import NextAuth from "next-auth";

import authConfig from "~/auth.config";
import { env } from "~/env";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut
} = NextAuth({
  adapter: FirestoreAdapter({
    credential: cert({
      projectId: env.ADMIN_FIREBASE_PROJECT_ID,
      clientEmail: env.ADMIN_FIREBASE_CLIENT_EMAIL,
      privateKey: env.ADMIN_FIREBASE_PRIVATE_KEY
    })
  }),
  debug: env.NODE_ENV === "development",
  ...authConfig
});

export async function getUserSession() {
  const userSession = await auth();

  if (!userSession) {
    throw new Error("User session not found");
  }

  return userSession;
}
