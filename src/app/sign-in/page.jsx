import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@/utils/auth";
import SignInComponent from "./_components/SignIn";

export default async function SignIn() {
  const session = await auth();

  // If already authenticated, redirect to dashboard
  if (session) {
    redirect("/dashboard");
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInComponent />
    </Suspense>
  );
}
