import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/utils/auth";
import { getUserFromDB } from "@/lib/getUser";
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

  return <DashboardContent />;
}
