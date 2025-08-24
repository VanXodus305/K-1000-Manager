import { signInWithGoogle } from "../auth";

export default async function SignInComponent() {
	// User is not signed in, show sign-in options
	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<form action={signInWithGoogle}>
				<button
					type="submit"
					className="px-4 py-2 bg-blue-500 text-white rounded"
				>
					Sign in with Google
				</button>
			</form>
		</div>
	);
}
