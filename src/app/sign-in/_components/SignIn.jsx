"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Form,
  Image,
} from "@heroui/react";
import localFont from "next/font/local";
import { signInWithGoogle } from "../auth";

const conthrax = localFont({
  src: "../../../../public/fonts/Conthrax-SemiBold.otf",
  variable: "--font-conthrax",
  display: "swap",
});

export default function SignInComponent() {
  return (
    <div className="flex items-center justify-center mt-14 px-4">
      <Card className="w-full max-w-md bg-background-200/80 backdrop-blur-sm border border-primary/20">
        <CardHeader className="flex flex-col gap-3 items-center pb-6 pt-8">
          <div className="flex flex-col items-center gap-2">
            <h1
              className={`text-2xl sm:text-4xl font-bold text-primary ${conthrax.className}`}
            >
              K-1000 Manager
            </h1>
          </div>
          <p className="text-sm text-foreground/70 text-center mt-2">
            All-in-one management system
          </p>
        </CardHeader>

        <Divider className="bg-primary/20" />

        <CardBody className="gap-6 py-8">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold text-foreground text-center">
              Welcome Back
            </h2>
            <p className="text-sm text-foreground/60 text-center">
              Sign in to access your dashboard
            </p>
          </div>

          <Form
            action={signInWithGoogle}
            className="w-full flex flex-col gap-4"
            validationBehavior="native"
          >
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-background-200 font-semibold"
              size="lg"
              startContent={
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Google_Favicon_2025.svg"
                  alt="Google Icon"
                  width={20}
                  height={20}
                />
              }
            >
              Sign in with Google
            </Button>
          </Form>

          <div className="relative">
            <Divider className="bg-foreground/20" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background-200 px-3 text-xs text-foreground/50">
              Secure Authentication
            </span>
          </div>

          <div className="text-center text-xs text-foreground/50">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
