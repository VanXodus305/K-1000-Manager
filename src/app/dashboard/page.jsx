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
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-foreground/70">
          Welcome back, {session?.user?.name}!
        </p>
      </div>

      {/* Dashboard content goes here */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder cards - replace with actual dashboard content */}
        <div className="bg-background-200/60 backdrop-blur-md border border-primary/20 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-primary mb-2">
            Quick Stats
          </h2>
          <p className="text-foreground/70">
            Dashboard statistics will appear here
          </p>
        </div>

        <div className="bg-background-200/60 backdrop-blur-md border border-primary/20 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-primary mb-2">
            Recent Activity
          </h2>
          <p className="text-foreground/70">
            Recent activities will appear here
          </p>
        </div>

        <div className="bg-background-200/60 backdrop-blur-md border border-primary/20 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-primary mb-2">
            System Status
          </h2>
          <p className="text-foreground/70">System status will appear here</p>
        </div>
      </div>
    </div>
  );
}
