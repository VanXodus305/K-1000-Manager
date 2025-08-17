import { NextResponse } from "next/server";
import { auth } from "./utils/auth";

// This function can be marked `async` if using `await` inside
export async function middleware(request) {
	const session = await auth();

	// If no session, redirect to /sign-in
	if (!session) {
		return NextResponse.redirect(new URL("/sign-in", request.url));
	}

	// If user is admin, redirect to /dashboard
	if (session?.user?.role === "admin") {
		return NextResponse.next();
	} else {
		return NextResponse.redirect(
			new URL("/sign-in?callback=missing-role", request.url),
		);
	}
}

export const config = {
	matcher: ["/dashboard"],
};
