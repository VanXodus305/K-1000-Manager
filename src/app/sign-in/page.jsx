import { Suspense } from "react";
import { auth } from "@/utils/auth";
import SignInComponent from "./_components/SignIn";
import { checkIfUserExists } from "./auth";

export default async function SignIn({ searchParams }) {
	const callback = (await searchParams).callback;
	const session = await auth();

	if (session) {
		switch (callback) {
			case "authenticated":
				await checkIfUserExists();
				break;
			case "missing-role":
				return (
					<span>
						You are not authorized to access this page. Please contact the
						administrator.
					</span>
				);
			case "error":
				return <span>An error occurred. Please try again later.</span>;
			default:
				break;
		}
	}

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<SignInComponent />
		</Suspense>
	);
}
