"use server";

import { auth, signIn } from "../utils/auth";

export async function googleSignIn() {
	try {
		await signIn("google");
	} catch (error) {
		// Check if this is a redirect (which is expected behavior)
		if (error.message === "NEXT_REDIRECT") {
			// This is expected - NextAuth is redirecting to Google
			throw error;
		}
		console.error("Customer sign-in error:", error);
		throw error;
	}
}

export async function checkSession() {
	return await auth();
}
