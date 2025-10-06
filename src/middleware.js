import { NextResponse } from "next/server";
import { auth } from "./utils/auth";

// This function can be marked `async` if using `await` inside
export async function middleware(request) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // If trying to access /sign-in while authenticated, redirect to dashboard
  if (pathname === "/sign-in" && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If trying to access /dashboard without authentication, redirect to sign-in
  if (pathname === "/dashboard" && !session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/sign-in"],
};
