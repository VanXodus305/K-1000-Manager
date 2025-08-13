"use client";

import React from "react";
import { signOut } from "next-auth/react";

export default function Dashboard() {
  return (
    <div>
      Dashboard
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => signOut({ callbackUrl: "/sign-in" })}
      >
        Sign Out
      </button>
    </div>
  );
}
