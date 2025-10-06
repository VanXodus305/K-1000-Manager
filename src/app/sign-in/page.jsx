import { Suspense } from "react";
import SignInComponent from "./_components/SignIn";

export default async function SignIn() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInComponent />
    </Suspense>
  );
}
