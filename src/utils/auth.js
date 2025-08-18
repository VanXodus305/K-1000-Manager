import mongoose from "mongoose";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
	if (mongoose.connection.readyState === 0) {
		try {
			await mongoose.connect(MONGODB_URI);
		} catch (error) {
			console.error("Error connecting to MongoDB Database:", error);
		}
	}
}

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [Google],
	callbacks: {
		session({ session, token }) {
			session.user.role = token.role;
			return session;
		},
		async jwt({ token, user }) {
			// Always fetch user from DB to get latest userType
			try {
				await connectDB();
				const email = user?.email || token?.email;
				if (email) {
					const User = mongoose.models.User;
					const dbUser = await User.findOne({ email });
					if (dbUser) {
						token.role = dbUser.role;
					}
				}
			} catch (error) {
				console.error("Error in jwt callback:", error);
			}
			return token;
		},
	},
});
