"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import MemberProfileForm from "./MemberProfileForm";
import MemberProfileView from "./MemberProfileView";

export default function MemberProfilePage() {
  const { data: session } = useSession();
  const [memberData, setMemberData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data on client side
  useEffect(() => {
    if (session?.user?.email) {
      const fetchUserData = async () => {
        try {
          const { getUserFromDB } = await import("@/actions/userActions");
          const user = await getUserFromDB();
          setMemberData(user);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setMemberData(null);
        } finally {
          setIsLoading(false);
        }
      };
      fetchUserData();
    }
  }, [session?.user?.email]);

  // Check if user has completed their profile
  const hasCompletedProfile =
    memberData &&
    memberData.rollNumber &&
    memberData.year &&
    memberData.branch &&
    memberData.vertical;

  const handleProfileSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const { updateMemberProfile } = await import("@/actions/memberActions");
      const result = await updateMemberProfile(formData);

      if (result.success) {
        setMemberData(result.member);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background-100 to-background-200 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-foreground/60">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (hasCompletedProfile) {
    return <MemberProfileView memberData={memberData} />;
  }

  return (
    <MemberProfileForm
      memberData={memberData}
      onSubmit={handleProfileSubmit}
      isLoading={false}
    />
  );
}
