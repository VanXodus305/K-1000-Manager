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
    // Extract roll number from email (part before @)
    const rollNumberFromEmail = user.email.split("@")[0];

    const data = {
      name: user.name,
      email: user.email,
      personalEmail: null,
      profileImage: user.image ? user.image.replace("=s96-c", "") : null, // Higher res image
      role: "member", // Default role for new users

      phoneNumber: null,
      whatsappNumber: null,
      rollNumber: rollNumberFromEmail,
      branch: null,
      year: null,
      vertical: null,
      subdomain: null,
      specialRole: null,

      socialLinks: {
        linkedin: "",
        github: "",
        instagram: "",
      },
      otherSocieties: [],
    };
    const newUser = await User.create(data);
    console.log("User created successfully:", newUser.email);
  } catch (error) {
    console.error("Error in checkIfUserExists:", error);
    console.error("Error details:", error.message);
    // Don't redirect on error, just log it
  }
}
