import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// Helper to fetch user role from database
async function getUserRole(email) {
  try {
    const mongoose = await import("mongoose");
    const MONGODB_URI = process.env.MONGODB_URI;

    if (mongoose.default.connection.readyState === 0) {
      await mongoose.default.connect(MONGODB_URI);
    }

    const User = (await import("@/models/userModel")).default;
    const user = await User.findOne({ email });
    return user?.role || "member";
  } catch (error) {
    console.error("Error fetching user role:", error);
    return "member";
  }
}

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
          const { createOrGetUser } = await import("@/actions/authActions");
          await createOrGetUser(user);
          return true;
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return true; // Still allow sign in even if DB operation fails
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user?.email) {
        const role = await getUserRole(session.user.email);
        session.user.role = role;
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
