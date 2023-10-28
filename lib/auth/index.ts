import "server-only";
import { FirestoreAdapter } from "@next-auth/firebase-adapter";
import { cert } from "firebase-admin/app";
import { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { env } from "~/env";

export const authOptions: NextAuthOptions = {
  adapter: FirestoreAdapter({
    credential: cert({
      projectId: env.ADMIN_FIREBASE_PROJECT_ID,
      clientEmail: env.ADMIN_FIREBASE_CLIENT_EMAIL,
      privateKey: env.ADMIN_FIREBASE_PRIVATE_KEY
    })
  }),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET
    })
  ],
  secret: env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.sub as string
      };
      session.exp = token.exp as string;
      return session;
    }
  },
  pages: {
    signIn: "/auth/signin"
  }
};
