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
    // Create new user
    const newUser = await User.create({
      name: userData.name,
      email: userData.email,
      profileImage: userData.image,
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
    return { success: true, user: newUser };
  } catch (error) {
    console.error("Error in createOrGetUser:", error);
    return { success: false, error: error.message };
  }
}
