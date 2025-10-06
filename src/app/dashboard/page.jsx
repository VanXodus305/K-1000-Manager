import React from "react";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/utils/auth";
import { getUserFromDB } from "@/lib/getUser";

export default async function Dashboard() {
  const session = await auth();

  // If not authenticated, redirect to sign-in
  if (!session) {
    redirect("/sign-in");
  }

  const user = await getUserFromDB();

  // Check if user is admin
  if (!user || user.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg">
          <h1 className="text-2xl font-bold text-red-700 mb-4">
            Access Denied
          </h1>
          <p className="text-red-600 mb-4">
            You are not authorized to access this page. Please contact the
            administrator to update your role.
          </p>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/sign-in" });
            }}
          >
            <button
              type="submit"
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {session?.user?.name}!</p>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/sign-in" });
        }}
      >
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Sign Out
        </button>
      </form>
    </div>
  );
}
