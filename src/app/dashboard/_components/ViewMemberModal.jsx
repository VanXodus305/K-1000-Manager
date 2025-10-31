"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
  Divider,
  Avatar,
  Tooltip,
} from "@heroui/react";
import { MdEmail, MdPerson, MdSchool, MdPhone } from "react-icons/md";
import {
  FaIdCard,
  FaCalendarAlt,
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaWhatsapp,
  FaBirthdayCake,
} from "react-icons/fa";
import { BiSolidBriefcase } from "react-icons/bi";
import { FaUser } from "react-icons/fa";
import { VERTICAL_DISPLAY_NAMES } from "@/constants/verticals";

export default function ViewMemberModal({ isOpen, onClose, member }) {
  if (!member) return null;

  // Helper function to get full form of vertical abbreviations
  const getVerticalTooltip = (vertical) => {
    return VERTICAL_DISPLAY_NAMES[vertical] || null;
  };

  // Helper function to get full form of role abbreviations
  const getRoleTooltip = (role) => {
    const tooltips = {
      CTO: "Chief Technology Officer",
      CCO: "Chief Creative Officer",
      CSO: "Chief Strategy Officer",
    };
    return tooltips[role] || null;
  };

  // Helper function to format special role
  const formatSpecialRole = (role) => {
    if (!role) return null;

    // Handle special cases for acronyms
    const formatted = role
      .split("-")
      .map((word) => {
        // Keep CTO, CCO, CSO as all caps
        if (
          word.toLowerCase() === "cto" ||
          word.toLowerCase() === "cco" ||
          word.toLowerCase() === "cso"
        ) {
          return word.toUpperCase();
        }
        // Title case for other words
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");

    return formatted;
  };

  // Helper function to format birthday
  const formatBirthday = (birthday) => {
    if (!birthday) return null;
    const date = new Date(birthday);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
    // Don't render if value is empty, null, or undefined (but render "N/A")
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      backdrop="blur"
      scrollBehavior="inside"
      classNames={{
        base: "bg-background-200/95 backdrop-blur-md border border-primary/30 max-h-[90vh]",
        header: "border-b border-primary/20 py-4",
        body: "py-4",
        footer: "border-t border-primary/20 py-3",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-foreground">Member Details</h2>
          <p className="text-xs text-foreground/60">
            Complete information about the member
          </p>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-3">
            {/* Profile Picture */}
            <div className="flex justify-center p-4">
              <Avatar
                src={member.profileImage}
                icon={<FaUser size={48} />}
                name={member.name}
                className="w-32 h-32"
                color="primary"
                classNames={{
                  base: "shrink-0 border-2 border-primary/30 shadow-lg shadow-primary/20",
                  icon: "text-foreground/80",
                }}
              />
            </div>

            {/* Basic Information */}
            <InfoRow icon={MdPerson} label="Full Name" value={member.name} />

            <InfoRow
              icon={MdEmail}
              label="College Email"
              value={member.email}
              isClickable={true}
              clickType="email"
            />

            {member.personalEmail && (
              <InfoRow
                icon={MdEmail}
                label="Personal Email"
                value={member.personalEmail}
                isClickable={true}
                clickType="email"
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InfoRow
                icon={FaCalendarAlt}
                label="Academic Year"
                value={member.year}
              />

              <InfoRow icon={MdSchool} label="Branch" value={member.branch} />
            </div>

            <InfoRow
              icon={FaIdCard}
              label="Roll Number"
              value={member.rollNo}
            />

            {member.birthday && (
              <InfoRow
                icon={FaBirthdayCake}
                label="Birthday"
                value={formatBirthday(member.birthday)}
              />
            )}

            {/* K-1000 Information */}
            <Divider className="my-2" />
            <h3 className="text-sm font-semibold text-primary">
              K-1000 Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InfoRow
                icon={BiSolidBriefcase}
                label="Vertical / Team"
                value={member.vertical || "N/A"}
                isPrimary={!!member.vertical}
                tooltip={
                  member.vertical ? getVerticalTooltip(member.vertical) : null
                }
              />

              <InfoRow
                icon={BiSolidBriefcase}
                label="Sub Domain"
                value={member.subdomain || "N/A"}
              />
            </div>

            <InfoRow
              icon={BiSolidBriefcase}
              label="Special Role"
              value={formatSpecialRole(member.specialRole) || "N/A"}
              isPrimary={!!member.specialRole}
              tooltip={
                member.specialRole
                  ? (() => {
                      const formattedRole = formatSpecialRole(
                        member.specialRole
                      );
                      const roleWords = formattedRole?.split(" ") || [];
                      const acronym = roleWords.find(
                        (word) =>
                          word === "CTO" || word === "CCO" || word === "CSO"
                      );
                      return acronym ? getRoleTooltip(acronym) : null;
                    })()
                  : null
              }
            />

            {/* Contact Information */}
            {(member.phoneNumber || member.whatsappNumber) && (
              <>
                <Divider className="my-2" />
                <h3 className="text-sm font-semibold text-primary">Contact</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {member.phoneNumber && (
                    <InfoRow
                      icon={MdPhone}
                      label="Phone Number"
                      value={member.phoneNumber}
                      isClickable={true}
                      clickType="phone"
                    />
                  )}

                  {member.whatsappNumber && (
                    <InfoRow
                      icon={FaWhatsapp}
                      label="WhatsApp Number"
                      value={member.whatsappNumber}
                      isClickable={true}
                      clickType="whatsapp"
                    />
                  )}
                </div>
              </>
            )}

            {/* Social Links */}
            {(member.socialLinks?.linkedin ||
              member.socialLinks?.github ||
              member.socialLinks?.instagram) && (
              <>
                <Divider className="my-2" />
                <h3 className="text-sm font-semibold text-primary">
                  Social Links
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {member.socialLinks?.linkedin && (
                    <SocialLink
                      icon={FaLinkedin}
                      label="LinkedIn"
                      url={member.socialLinks.linkedin}
                    />
                  )}
                  {member.socialLinks?.github && (
                    <SocialLink
                      icon={FaGithub}
                      label="GitHub"
                      url={member.socialLinks.github}
                    />
                  )}
                  {member.socialLinks?.instagram && (
                    <SocialLink
                      icon={FaInstagram}
                      label="Instagram"
                      url={member.socialLinks.instagram}
                    />
                  )}
                </div>
              </>
            )}

            {/* Other Societies */}
            {member.otherSocieties && member.otherSocieties.length > 0 && (
              <>
                <Divider className="my-2" />
                <InfoRow
                  icon={BiSolidBriefcase}
                  label="Other Societies"
                  value={member.otherSocieties}
                />
              </>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onPress={onClose}
            className="bg-primary text-background-200 font-semibold hover:bg-primary/90"
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
