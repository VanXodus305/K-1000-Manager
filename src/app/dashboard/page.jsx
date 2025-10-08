import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/utils/auth";
import { getUserFromDB } from "@/actions/userActions";
import { getAllMembers } from "@/actions/memberActions";
import DashboardContent from "./_components/DashboardContent";
import AccessDenied from "./_components/AccessDenied";

export default async function Dashboard() {
  const session = await auth();

  // If not authenticated, redirect to sign-in
  if (!session) {
    redirect("/sign-in");
  }

  const user = await getUserFromDB();

  // Check if user is admin
  if (!user || user.role !== "admin") {
    return <AccessDenied />;
  }

  // Fetch all members from database
  const result = await getAllMembers();
  const members = result.success ? result.members : [];

  return <DashboardContent initialMembers={members} />;
}
