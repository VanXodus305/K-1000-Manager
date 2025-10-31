"use server";

import mongoose from "mongoose";
import User from "../models/userModel";
import { revalidatePath } from "next/cache";
import { deleteImage } from "./imageActions";
import { VERTICALS } from "@/constants/verticals";

const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(MONGODB_URI);
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      throw error;
    }
  }
}

export async function getAllMembers() {
  try {
    await connectDB();

    const members = await User.find({})
      .select(
        "_id name email rollNumber branch year vertical subdomain specialRole phoneNumber whatsappNumber personalEmail profileImage socialLinks otherSocieties birthday createdAt updatedAt"
      )
      .lean();

    // Convert MongoDB _id to string id and format data
    const formattedMembers = members.map((member) => ({
      id: member._id.toString(),
      name: member.name || "",
      email: member.email || "",
      rollNo: member.rollNumber || "",
      branch: member.branch || "",
      year: member.year || "",
      vertical: member.vertical || "",
      subdomain: member.subdomain || "",
      specialRole: member.specialRole || null,
      phoneNumber: member.phoneNumber || "",
      whatsappNumber: member.whatsappNumber || "",
      personalEmail: member.personalEmail || "",
      profileImage: member.profileImage || "",
      birthday: member.birthday ? member.birthday.toISOString() : null,
      socialLinks: member.socialLinks || {
        linkedin: "",
        github: "",
        instagram: "",
      },
      otherSocieties: member.otherSocieties || [],
      createdAt: member.createdAt?.toISOString() || "",
      updatedAt: member.updatedAt?.toISOString() || "",
    }));

    return { success: true, members: formattedMembers };
  } catch (error) {
    console.error("Error fetching members:", error);
    return { success: false, error: error.message, members: [] };
  }
}

export async function addMember(memberData) {
  try {
    await connectDB();

    const newMember = await User.create({
      name: memberData.name,
      email: memberData.email,
      personalEmail: memberData.personalEmail || null,
      profileImage: memberData.profileImage || null,
      rollNumber: memberData.rollNo,
      branch: memberData.branch || null,
      year: parseInt(memberData.year),
      vertical: memberData.vertical,
      subdomain: memberData.subdomain || null,
      specialRole: memberData.specialRole || null,
      birthday: memberData.birthday || null,
      phoneNumber: memberData.phoneNumber || null,
      whatsappNumber: memberData.whatsappNumber || null,
      socialLinks: memberData.socialLinks || {
        linkedin: "",
        github: "",
        instagram: "",
      },
      otherSocieties: memberData.otherSocieties || [],
      role: "member",
    });

    revalidatePath("/dashboard");

    return {
      success: true,
      member: {
        id: newMember._id.toString(),
        name: newMember.name,
        email: newMember.email,
        personalEmail: newMember.personalEmail,
        profileImage: newMember.profileImage,
        rollNo: newMember.rollNumber,
        branch: newMember.branch,
        year: newMember.year,
        vertical: newMember.vertical,
        subdomain: newMember.subdomain,
        specialRole: newMember.specialRole,
        birthday: newMember.birthday ? newMember.birthday.toISOString() : null,
        phoneNumber: newMember.phoneNumber,
        whatsappNumber: newMember.whatsappNumber,
        socialLinks: newMember.socialLinks,
        otherSocieties: newMember.otherSocieties,
      },
    };
  } catch (error) {
    console.error("Error adding member:", error);
    return { success: false, error: error.message };
  }
}

export async function updateMember(memberId, memberData) {
  try {
    await connectDB();

    const updatedMember = await User.findByIdAndUpdate(
      memberId,
      {
        name: memberData.name,
        email: memberData.email,
        personalEmail: memberData.personalEmail || null,
        profileImage: memberData.profileImage || null,
        rollNumber: memberData.rollNo,
        branch: memberData.branch || null,
        year: parseInt(memberData.year),
        vertical: memberData.vertical,
        subdomain: memberData.subdomain || null,
        specialRole: memberData.specialRole || null,
        birthday: memberData.birthday || null,
        phoneNumber: memberData.phoneNumber || null,
        whatsappNumber: memberData.whatsappNumber || null,
        socialLinks: memberData.socialLinks || {
          linkedin: "",
          github: "",
          instagram: "",
        },
        otherSocieties: memberData.otherSocieties || [],
      },
      { new: true }
    );

    if (!updatedMember) {
      return { success: false, error: "Member not found" };
    }

    revalidatePath("/dashboard");

    return {
      success: true,
      member: {
        id: updatedMember._id.toString(),
        name: updatedMember.name,
        email: updatedMember.email,
        personalEmail: updatedMember.personalEmail,
        profileImage: updatedMember.profileImage,
        rollNo: updatedMember.rollNumber,
        branch: updatedMember.branch,
        year: updatedMember.year,
        vertical: updatedMember.vertical,
        subdomain: updatedMember.subdomain,
        specialRole: updatedMember.specialRole,
        birthday: updatedMember.birthday
          ? updatedMember.birthday.toISOString()
          : null,
        phoneNumber: updatedMember.phoneNumber,
        whatsappNumber: updatedMember.whatsappNumber,
        socialLinks: updatedMember.socialLinks,
        otherSocieties: updatedMember.otherSocieties,
      },
    };
  } catch (error) {
    console.error("Error updating member:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteMembers(memberIds) {
  try {
    await connectDB();

    // First, get the members to extract their profile image URLs
    const members = await User.find({ _id: { $in: memberIds } }).select(
      "profileImage"
    );

    // Delete profile images from Cloudinary
    const deletePromises = members
      .filter((member) => member.profileImage)
      .map((member) => deleteImage(member.profileImage));

    await Promise.allSettled(deletePromises);

    // Then delete the members from database
    await User.deleteMany({ _id: { $in: memberIds } });

    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error deleting members:", error);
    return { success: false, error: error.message };
  }
}

export async function getUniqueBranches() {
  try {
    await connectDB();

    // Get all unique branches from the database, excluding null/empty values
    const branches = await User.distinct("branch");
    const filteredBranches = branches.filter(
      (branch) => branch && branch.trim() !== ""
    );

    // Sort alphabetically
    filteredBranches.sort();

    return { success: true, branches: filteredBranches };
  } catch (error) {
    console.error("Error fetching unique branches:", error);
    return { success: false, error: error.message, branches: [] };
  }
}

export async function getUniqueSubdomains() {
  try {
    await connectDB();

    // Get all unique subdomains from the database, excluding null/empty values
    const subdomains = await User.distinct("subdomain");
    const filteredSubdomains = subdomains.filter(
      (subdomain) => subdomain && subdomain.trim() !== ""
    );

    // Sort alphabetically
    filteredSubdomains.sort();

    return { success: true, subdomains: filteredSubdomains };
  } catch (error) {
    console.error("Error fetching unique subdomains:", error);
    return { success: false, error: error.message, subdomains: [] };
  }
}

export async function getFormOptions() {
  try {
    await connectDB();

    // Get unique branches
    const branches = await User.distinct("branch");
    const filteredBranches = branches
      .filter((branch) => branch && branch.trim() !== "")
      .sort();

    // Get unique subdomains
    const subdomains = await User.distinct("subdomain");
    const filteredSubdomains = subdomains
      .filter((subdomain) => subdomain && subdomain.trim() !== "")
      .sort();

    // Year options (hardcoded as these are standard)
    const yearOptions = ["1st", "2nd", "3rd", "4th", "5th"];

    // Vertical options from constants
    const verticalOptions = VERTICALS;

    return {
      success: true,
      options: {
        years: yearOptions,
        branches: filteredBranches,
        verticals: verticalOptions,
        subdomains: filteredSubdomains,
      },
    };
  } catch (error) {
    console.error("Error fetching form options:", error);
    return {
      success: false,
      error: error.message,
      options: {
        years: ["1st", "2nd", "3rd", "4th", "5th"],
        branches: [],
        verticals: VERTICALS,
        subdomains: [],
      },
    };
  }
}

export async function updateMemberProfile(memberData) {
  try {
    await connectDB();
    const { auth } = await import("@/utils/auth");
    const session = await auth();

    if (!session || !session.user) {
      return { success: false, error: "Not authenticated" };
    }

    const updatedMember = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        name: memberData.name,
        email: memberData.email,
        personalEmail: memberData.personalEmail || null,
        rollNumber: memberData.rollNo,
        branch: memberData.branch || null,
        year: parseInt(memberData.year),
        vertical: memberData.vertical,
        subdomain: memberData.subdomain || null,
        phoneNumber: memberData.phoneNumber || null,
        whatsappNumber: memberData.whatsappNumber || null,
        birthday: memberData.birthday || null,
        profileImage: memberData.profileImage || null,
        socialLinks: memberData.socialLinks || {
          linkedin: "",
          github: "",
          instagram: "",
        },
        otherSocieties: memberData.otherSocieties || [],
      },
      { new: true }
    );

    if (!updatedMember) {
      return { success: false, error: "Member not found" };
    }

    revalidatePath("/dashboard");

    return {
      success: true,
      member: {
        id: updatedMember._id.toString(),
        name: updatedMember.name,
        email: updatedMember.email,
        personalEmail: updatedMember.personalEmail,
        profileImage: updatedMember.profileImage,
        rollNumber: updatedMember.rollNumber,
        rollNo: updatedMember.rollNumber,
        branch: updatedMember.branch,
        year: updatedMember.year,
        vertical: updatedMember.vertical,
        subdomain: updatedMember.subdomain,
        phoneNumber: updatedMember.phoneNumber,
        whatsappNumber: updatedMember.whatsappNumber,
        birthday: updatedMember.birthday
          ? updatedMember.birthday.toISOString()
          : null,
        socialLinks: updatedMember.socialLinks,
        otherSocieties: updatedMember.otherSocieties,
      },
    };
  } catch (error) {
    console.error("Error updating member profile:", error);
    return { success: false, error: error.message };
  }
}
