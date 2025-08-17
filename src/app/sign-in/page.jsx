import { redirect } from "next/navigation";
import { Suspense } from "react";
import SignInComponent from "./_components/SignIn";

export default async function SignIn({ searchParams }) {
	const callback = (await searchParams).callback;

	if (callback === "authenticated") {
		redirect("/dashboard");
	}

	if (callback === "missing-role") {
		return (
			<span>
				You are not authorized to access this page. Please contact the
				administrator.
			</span>
		);
	}

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<SignInComponent />
		</Suspense>
	);
}
