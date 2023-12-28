import { type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

export default {
  providers: [Google],
  pages: {
    signIn: "/auth/signin",
    newUser: "/introduction"
  },
  callbacks: {
    authorized({ auth }) {
      return !!auth?.user;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.sub as string
      };

      return session;
    }
  },
  session: {
    strategy: "jwt"
  }
} satisfies NextAuthConfig;
