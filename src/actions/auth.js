"use server";

import { signIn, signOut } from "../utils/auth";

export async function signInDemo() {
	try {
		// Sign in with Google and pass the intended user type
		await signIn("google");
	} catch (error) {
		console.error("Vendor sign-in error:", error);
		throw error;
	}
}

export async function signOutAndRedirect() {
	try {
		await signOut({ redirectTo: "/" });
	} catch (error) {
		console.error("Sign-out error:", error);
		throw error;
	}
}
