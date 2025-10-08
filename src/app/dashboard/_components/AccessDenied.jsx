"use client";

import { Card, CardBody, Button, Divider, Chip } from "@heroui/react";
import { MdWarningAmber } from "react-icons/md";
import { signOutAndRedirect } from "@/app/sign-in/auth";

export default function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center mt-10 px-4">
      <Card className="w-full max-w-md bg-background-200/80 backdrop-blur-md border border-danger/30 shadow-2xl">
        <CardBody className="gap-6 py-10 px-8">
          <div className="flex flex-col items-center gap-4">
            {/* Icon */}
            <div className="p-4 bg-danger/20 rounded-full border border-danger/40">
              <MdWarningAmber className="w-12 h-12 text-danger" />
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-foreground text-center">
              Access Denied
            </h1>

            {/* Description */}
            <p className="text-foreground/70 text-center leading-relaxed">
              You are not authorized to access this page. Please contact the
              administrator to update your role to access the dashboard.
            </p>

            {/* Divider */}
            <Divider className="my-2 bg-gradient-to-r from-transparent via-danger/30 to-transparent" />

            {/* Sign Out Button */}
            <Button
              color="danger"
              size="lg"
              className="w-full font-semibold shadow-lg hover:shadow-danger/50"
              onPress={signOutAndRedirect}
            >
              Sign Out
            </Button>

            {/* Additional Info */}
            <div className="text-center mt-2">
              <p className="text-xs text-foreground/50 inline">
                Current Role:{" "}
              </p>
              <Chip
                size="sm"
                variant="flat"
                className="bg-secondary/20 text-secondary border border-secondary/30"
              >
                Member
              </Chip>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
