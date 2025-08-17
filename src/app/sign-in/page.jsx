import { auth } from "@/utils/auth";
import { signInDemo } from "@/actions/auth";
import { redirect } from "next/navigation";

export default async function SignIn() {
  const session = await auth();
  console.log("/profile session:", session);

  if (session?.user && session.user.role === "admin") {
    redirect("/dashboard");
  }
  // User is not signed in, show sign-in options
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <form action={signInDemo}>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Sign in with Google
        </button>
      </form>
    </div>
  );
}
