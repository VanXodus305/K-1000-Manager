"use client";

import { useEffect } from "react";
import { checkSession, googleSignIn } from "@/actions/auth";

export default function Home() {
	useEffect(() => {
		async function checkUserSession() {
			const session = await checkSession();
			console.log(session);
		}
		checkUserSession();
	}, []);

	return (
		<div className="flex flex-col items-center justify-center h-screen">
			K-1000 Manager Project
			<button
				type="submit"
				onClick={async () => {
					await googleSignIn();
				}}
				className="bg-red-400 p-2 hover:bg-red-600 rounded-md text-white"
			>
				Sign In
			</button>
		</div>
	);
}
