"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Image,
} from "@heroui/react";
import { useSession } from "next-auth/react";
import { signOutAndRedirect } from "@/app/sign-in/auth";

export default function GlobalNavbar() {
  const { data: session } = useSession();

  return (
    <Navbar
      isBordered
      isBlurred
      shouldHideOnScroll
      className="bg-background-200/60 backdrop-blur-md border-b border-primary/20"
      classNames={{
        wrapper: "max-w-full px-6",
      }}
      position="sticky"
      maxWidth="full"
    >
      {/* Logo Section */}
      <NavbarBrand>
        <Image
          src="/images/logo-horizontal.png"
          alt="K-1000 Manager"
          height={40}
          className="h-10"
        />
      </NavbarBrand>

      {/* Right Side - User Profile */}
      <NavbarContent justify="end">
        <NavbarItem className="flex items-center gap-3">
          {session?.user && (
            <>
              <span className="text-sm font-medium text-foreground hidden sm:block">
                {session.user.name}
              </span>
              <Dropdown placement="bottom-end" classNames={{
                base: 'overflow-hidden'
              }}>
                <DropdownTrigger>
                  <Avatar
                    as="button"
                    className="transition-transform cursor-pointer shadow-primary/50 shadow-md hover:scale-105"
                    color="primary"
                    name={session.user.name}
                    size="sm"
                    showFallback
                    src={session.user.image}
                  />
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Profile Actions"
                  variant="flat"
                  classNames={{
                    base: "bg-background-200/80 rounded-[10px]",
                  }}
                  className="backdrop-blur-md"
                >
                  <DropdownItem
                    key="profile"
                    className="h-14 gap-2"
                    textValue="Profile"
                  >
                    <p className="font-semibold text-foreground">
                      Signed in as
                    </p>
                    <p className="font-semibold text-primary">
                      {session.user.email}
                    </p>
                  </DropdownItem>
                  {/* <DropdownItem
                    key="settings"
                    className="text-foreground"
                    textValue="Settings"
                  >
                    Settings
                  </DropdownItem> */}
                  {/* <DropdownItem
                    key="help"
                    className="text-foreground"
                    textValue="Help & Support"
                  >
                    Help & Support
                  </DropdownItem> */}
                  <DropdownItem
                    key="logout"
                    color="danger"
                    className="text-danger"
                    onPress={() => signOutAndRedirect()}
                    textValue="Sign Out"
                  >
                    Sign Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </>
          )}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
