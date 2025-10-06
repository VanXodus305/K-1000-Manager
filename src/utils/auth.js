import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // This callback runs in Node.js runtime, so we can use server actions
      if (account?.provider === "google") {
        try {
          // Dynamically import the helper to avoid Edge runtime issues
          const { createOrGetUser } = await import("@/lib/authHelpers");
          await createOrGetUser(user);
          return true;
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return true; // Still allow sign in even if DB operation fails
        }
      }
      return true;
    },
    session({ session, token }) {
      if (token.role) {
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      // Only store basic user info in JWT token
      if (user) {
        token.email = user.email;
      }
      return token;
    },
  },
});
