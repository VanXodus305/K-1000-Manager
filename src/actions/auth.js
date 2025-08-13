"use server";

import { signIn, signOut } from "@/utils/auth";

export async function signInDemo() {
	try {
		await signIn("google");
	} catch (error) {
		console.error("Sign-in error:", error);
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
