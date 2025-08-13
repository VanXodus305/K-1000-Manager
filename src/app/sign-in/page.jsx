import { auth } from "../../utils/auth";

export default async function SignIn() {
	const session = await auth();
	console.log("/profile session:", session);

	// User is not signed in, show sign-in options
	return <></>;
}
