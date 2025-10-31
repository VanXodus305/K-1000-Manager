"use client";

import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Divider,
  Avatar,
  Tooltip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import localFont from "next/font/local";
import { MdEmail, MdPerson, MdSchool, MdPhone, MdLogout } from "react-icons/md";
import {
  FaIdCard,
  FaCalendarAlt,
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaWhatsapp,
  FaBirthdayCake,
  FaUser,
  FaEllipsisV,
} from "react-icons/fa";
import { BiSolidBriefcase } from "react-icons/bi";
import { signOut } from "next-auth/react";
import { VERTICAL_DISPLAY_NAMES } from "@/constants/verticals";

const conthrax = localFont({
  src: "../../../../public/fonts/Conthrax-SemiBold.otf",
  variable: "--font-conthrax",
  display: "swap",
});

export default function MemberProfileView({ memberData }) {
  const formatBirthday = (birthday) => {
    if (!birthday) return null;
    const date = new Date(birthday);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getVerticalTooltip = (vertical) => {
    return VERTICAL_DISPLAY_NAMES[vertical] || null;
  };

  const InfoRow = ({
    icon: Icon,
    label,
    value,
    isPrimary = false,
    isClickable = false,
    clickType = null,
    tooltip = null,
  }) => {
    if (
      (!value && value !== "N/A") ||
      value === "" ||
      (Array.isArray(value) && value.length === 0)
    ) {
      return null;
    }

    const getClickableHref = () => {
      if (!isClickable) return null;

      switch (clickType) {
        case "email":
          return `mailto:${value}`;
        case "phone":
          return `tel:${value}`;
        case "whatsapp":
          return `https://wa.me/${value.replace(/\D/g, "")}`;
        default:
          return null;
      }
    };

    const href = getClickableHref();

    const chipContent = isPrimary ? (
      tooltip ? (
        <Tooltip content={tooltip} delay={300}>
          <Chip
            size="sm"
            variant="flat"
            className="bg-primary/20 text-primary border border-primary/30 cursor-help"
          >
            {value}
          </Chip>
        </Tooltip>
      ) : (
        <Chip
          size="sm"
          variant="flat"
          className="bg-primary/20 text-primary border border-primary/30"
        >
          {value}
        </Chip>
      )
    ) : null;

    const content = (
      <>
        <div className="p-2 bg-primary/10 rounded-lg border border-primary/20 shrink-0">
          <Icon className="text-primary" size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-foreground/60 mb-0.5">{label}</p>
          {isPrimary ? (
            chipContent
          ) : Array.isArray(value) ? (
            <div className="flex flex-wrap gap-1">
              {value.map((item, index) => (
                <Chip
                  key={index}
                  size="sm"
                  variant="flat"
                  className="bg-secondary/20 text-foreground border border-secondary/30"
                >
                  {item}
                </Chip>
              ))}
            </div>
          ) : (
            <p
              className={`text-sm text-foreground font-medium truncate ${
                isClickable ? "hover:text-primary transition-colors" : ""
              }`}
            >
              {value}
            </p>
          )}
        </div>
      </>
    );

    return isClickable && href ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 bg-background-100/30 rounded-lg border border-primary/10 px-3 py-2.5 hover:bg-primary/10 hover:border-primary/30 transition-all cursor-pointer"
      >
        {content}
      </a>
    ) : (
      <div className="flex items-center gap-3 bg-background-100/30 rounded-lg border border-primary/10 px-3 py-2.5">
        {content}
      </div>
    );
  };

  const SocialLink = ({ icon: Icon, label, url }) => {
    if (!url || url === "") return null;

    return (
      <a
        href={url.startsWith("http") ? url : `https://${url}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 bg-background-100/30 rounded-lg border border-primary/10 px-3 py-2.5 hover:bg-primary/10 hover:border-primary/30 transition-all cursor-pointer"
      >
        <div className="p-2 bg-primary/10 rounded-lg border border-primary/20 shrink-0">
          <Icon className="text-primary" size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-foreground/60 mb-0.5">Visit Profile</p>
          <p className="text-sm text-foreground font-medium hover:text-primary transition-colors">
            {label}
          </p>
        </div>
      </a>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-100 to-background-200 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with Logout */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1
              className={`${conthrax.className} text-4xl font-bold text-foreground mb-2`}
            >
              My Profile
            </h1>
            <p className="text-foreground/60">View your complete information</p>
          </div>

          {/* Dropdown Menu */}
          {/* <Dropdown backdrop="blur">
            <DropdownTrigger>
              <Button
                isIconOnly
                color="primary"
                variant="flat"
                className="bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30"
              >
                <FaEllipsisV size={20} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="User actions">
              <DropdownItem
                key="logout"
                color="danger"
                startContent={<MdLogout size={20} />}
                onPress={() => signOut({ redirectTo: "/sign-in" })}
              >
                Sign Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown> */}
        </div>

        {/* Profile Card */}
        <Card className="bg-background-200/50 backdrop-blur-md border border-primary/30 shadow-lg">
          {/* Profile Header */}
          <CardHeader className="flex flex-col gap-3 border-b border-primary/20 p-6">
            <div className="flex items-center gap-4">
              <Avatar
                src={memberData?.profileImage}
                icon={<FaUser size={48} />}
                name={memberData?.name}
                className="w-32 h-32"
                color="primary"
                classNames={{
                  base: "shrink-0 border-2 border-primary/30 shadow-lg shadow-primary/50",
                  icon: "text-foreground/80",
                }}
              />
              <div className="flex-1">
                <p className="text-foreground/60 text-sm">Member</p>
                <h2
                  className={`${conthrax.className} text-3xl font-bold text-foreground`}
                >
                  {memberData?.name}
                </h2>
                <p className="text-foreground/60 mt-1">{memberData?.email}</p>
              </div>
            </div>
          </CardHeader>

          <CardBody className="gap-6 p-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-primary mb-4">
                Basic Information
              </h3>
              <div className="flex flex-col gap-3">
                <InfoRow
                  icon={MdPerson}
                  label="Full Name"
                  value={memberData?.name}
                />

                <InfoRow
                  icon={MdEmail}
                  label="College Email"
                  value={memberData?.email}
                  isClickable={true}
                  clickType="email"
                />

                {memberData?.personalEmail && (
                  <InfoRow
                    icon={MdEmail}
                    label="Personal Email"
                    value={memberData?.personalEmail}
                    isClickable={true}
                    clickType="email"
                  />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <InfoRow
                    icon={FaCalendarAlt}
                    label="Academic Year"
                    value={memberData?.year}
                  />

                  <InfoRow
                    icon={MdSchool}
                    label="Branch"
                    value={memberData?.branch}
                  />
                </div>

                <InfoRow
                  icon={FaIdCard}
                  label="Roll Number"
                  value={memberData?.rollNumber}
                />

                {memberData?.birthday && (
                  <InfoRow
                    icon={FaBirthdayCake}
                    label="Birthday"
                    value={formatBirthday(memberData?.birthday)}
                  />
                )}
              </div>
            </div>

            {/* K-1000 Information */}
            <div>
              <Divider className="my-2" />
              <h3 className="text-lg font-semibold text-primary my-4">
                K-1000 Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InfoRow
                  icon={BiSolidBriefcase}
                  label="Vertical / Team"
                  value={memberData?.vertical || "N/A"}
                  isPrimary={!!memberData?.vertical}
                  tooltip={
                    memberData?.vertical
                      ? getVerticalTooltip(memberData?.vertical)
                      : null
                  }
                />

                <InfoRow
                  icon={BiSolidBriefcase}
                  label="Sub Domain"
                  value={memberData?.subdomain || "N/A"}
                />
              </div>
            </div>

            {/* Contact Information */}
            {(memberData?.phoneNumber || memberData?.whatsappNumber) && (
              <>
                <Divider className="my-2" />
                <h3 className="text-lg font-semibold text-primary">Contact</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {memberData?.phoneNumber && (
                    <InfoRow
                      icon={MdPhone}
                      label="Phone Number"
                      value={memberData?.phoneNumber}
                      isClickable={true}
                      clickType="phone"
                    />
                  )}

                  {memberData?.whatsappNumber && (
                    <InfoRow
                      icon={FaWhatsapp}
                      label="WhatsApp Number"
                      value={memberData?.whatsappNumber}
                      isClickable={true}
                      clickType="whatsapp"
                    />
                  )}
                </div>
              </>
            )}

            {/* Social Links */}
            {(memberData?.socialLinks?.linkedin ||
              memberData?.socialLinks?.github ||
              memberData?.socialLinks?.instagram) && (
              <>
                <Divider className="my-2" />
                <h3 className="text-lg font-semibold text-primary">
                  Social Links
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {memberData?.socialLinks?.linkedin && (
                    <SocialLink
                      icon={FaLinkedin}
                      label="LinkedIn"
                      url={memberData?.socialLinks?.linkedin}
                    />
                  )}
                  {memberData?.socialLinks?.github && (
                    <SocialLink
                      icon={FaGithub}
                      label="GitHub"
                      url={memberData?.socialLinks?.github}
                    />
                  )}
                  {memberData?.socialLinks?.instagram && (
                    <SocialLink
                      icon={FaInstagram}
                      label="Instagram"
                      url={memberData?.socialLinks?.instagram}
                    />
                  )}
                </div>
              </>
            )}

            {/* Other Societies */}
            {memberData?.otherSocieties &&
              memberData?.otherSocieties.length > 0 && (
                <>
                  <Divider className="my-2" />
                  <InfoRow
                    icon={BiSolidBriefcase}
                    label="Other Societies"
                    value={memberData?.otherSocieties}
                  />
                </>
              )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
