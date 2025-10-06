import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user, account, profile }) {
      // This callback runs in Node.js runtime, so we can use Mongoose
      if (account?.provider === "google") {
        try {
          // Dynamically import to ensure this only runs in Node.js runtime
          const mongoose = (await import("mongoose")).default;
          const { default: User } = await import("@/lib/models/userModel");

          const MONGODB_URI = process.env.MONGODB_URI;

          // Connect to database
          if (mongoose.connection.readyState === 0) {
            await mongoose.connect(MONGODB_URI);
          }

          console.log("Checking if user exists:", user.email);

          // Check if user already exists
          const existingUser = await User.findOne({ email: user.email });

          if (existingUser) {
            console.log("User already exists:", existingUser.email);
            return true;
          }

          console.log("Creating new user...");
          // Create new user
          const newUser = await User.create({
            name: user.name,
            email: user.email,
            profileImage: user.image,
            role: "member",
            phoneNumber: null,
            rollNumber: null,
            department: null,
            year: null,
            joiningDate: null,
            socialLinks: {
              linkedin: "",
              github: "",
              instagram: "",
            },
          });

          console.log("User created successfully:", newUser.email);
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
