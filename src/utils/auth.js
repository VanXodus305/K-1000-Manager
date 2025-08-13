import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const authConfig = NextAuth({
	providers: [
		Google({
			clientId: process.env.AUTH_GOOGLE_ID,
			clientSecret: process.env.AUTH_GOOGLE_SECRET,
		}),
	],
	callbacks: {
		async signIn({ account, profile }) {
			if (account.provider === "google") {
				return profile.email_verified && profile.email.endsWith("@kiit.ac.in");
			}
			return false;
		},
	},
});

export const handlers = authConfig.handlers;
export const signIn = authConfig.signIn;
export const signOut = authConfig.signOut;
export const auth = authConfig.auth;
