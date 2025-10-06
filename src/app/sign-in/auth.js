"use server";

import mongoose from "mongoose";
import { redirect } from "next/navigation";
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
  await signIn("google", { redirectTo: "/dashboard" });
}

export async function signOutAndRedirect() {
  await signOut({ redirectTo: "/" });
}

export async function checkIfUserExists() {
  const session = await auth();

  if (!session || !session.user) {
    console.error("No session found in checkIfUserExists");
    return;
  }

  try {
    await connectDB();
    console.log("Connected to DB, checking for user:", session.user.email);

    // Check if user already exists
    const existingUser = await User.findOne({ email: session.user.email });

    if (existingUser) {
      console.log("User already exists:", existingUser.email);
      return;
    }

    console.log("Creating new user...");
    const { user } = session;
    const data = {
      name: user.name,
      email: user.email,
      profileImage: user.image,
      role: "member", // Default role for new users

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
    };
    const newUser = await User.create(data);
    console.log("User created successfully:", newUser.email);
  } catch (error) {
    console.error("Error in checkIfUserExists:", error);
    console.error("Error details:", error.message);
    // Don't redirect on error, just log it
  }
}
