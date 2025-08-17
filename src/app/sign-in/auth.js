"use server";

import mongoose from "mongoose";
import User from "@/lib/models/userModel";
import { auth, signIn, signOut } from "@/utils/auth";

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

export async function signInWithGoogle() {
	try {
		await signIn("google", { redirectTo: "/sign-in?callback=authenticated" });
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

export async function checkIfUserExists() {
	const session = await auth();

	try {
		await connectDB();

		// Check if user already exists
		const existingUser = await User.findOne({ email: session.user.email });

		console.log(existingUser);

		if (!existingUser) {
			const { user } = session;
			const data = {
				name: user.name,
				email: user.email,
				profileImage: user.image,
				socialLinks: {
					linkedin: "",
					github: "",
					instagram: "",
				},
			};
			User.create(data);
			return true;
		}
	} catch (error) {
		console.error("Error in auth callback:", error);
		redirect("/sign-in?callback=error");
	}
}
