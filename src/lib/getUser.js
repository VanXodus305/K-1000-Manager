"use server";

import mongoose from "mongoose";
import User from "@/lib/models/userModel";
import { auth } from "@/utils/auth";

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

export async function getUserFromDB() {
  const session = await auth();

  if (!session || !session.user) {
    return null;
  }

  try {
    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    return user ? user.toObject() : null;
  } catch (error) {
    console.error("Error fetching user from DB:", error);
    return null;
  }
}
