"use server";

import mongoose from "mongoose";
import User from "@/lib/models/userModel";

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

export async function createOrGetUser(userData) {
  try {
    await connectDB();

    console.log("Checking if user exists:", userData.email);

    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });

    if (existingUser) {
      console.log("User already exists:", existingUser.email);
      return { success: true, user: existingUser };
    }

    console.log("Creating new user...");
    // Extract roll number from email (part before @)
    const rollNumberFromEmail = userData.email.split("@")[0];

    // Create new user with updated schema
    const newUser = await User.create({
      name: userData.name,
      email: userData.email,
      personalEmail: null,
      profileImage: userData.image
        ? userData.image.replace("=s96-c", "")
        : null,
      role: "member",
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
    });

    console.log("User created successfully:", newUser.email);
    return { success: true, user: newUser };
  } catch (error) {
    console.error("Error in createOrGetUser:", error);
    return { success: false, error: error.message };
  }
}
