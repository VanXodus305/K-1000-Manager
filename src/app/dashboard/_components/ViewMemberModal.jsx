"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
} from "@heroui/react";
import { MdEmail, MdPerson, MdSchool } from "react-icons/md";
import { FaIdCard, FaCalendarAlt } from "react-icons/fa";
import { BiSolidBriefcase } from "react-icons/bi";

export default function ViewMemberModal({ isOpen, onClose, member }) {
  if (!member) return null;

  const InfoRow = ({ icon: Icon, label, value, isPrimary = false }) => (
    <div className="flex items-center gap-3 bg-background-100/30 rounded-lg border border-primary/10 px-3 py-2.5">
      <div className="p-2 bg-primary/10 rounded-lg border border-primary/20 shrink-0">
        <Icon className="text-primary" size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-foreground/60 mb-0.5">{label}</p>
        {isPrimary ? (
          <Chip
            size="sm"
            variant="flat"
            className="bg-primary/20 text-primary border border-primary/30"
          >
            {value}
          </Chip>
        ) : (
          <p className="text-sm text-foreground font-medium truncate">
            {value}
          </p>
        )}
      </div>
    </div>
  );

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
            <InfoRow icon={MdPerson} label="Full Name" value={member.name} />

            <InfoRow
              icon={MdEmail}
              label="Email Address"
              value={`${member.rollNo}@kiit.ac.in`}
            />

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InfoRow
                icon={BiSolidBriefcase}
                label="Vertical / Team"
                value={member.vertical}
                isPrimary={true}
              />

              <InfoRow
                icon={BiSolidBriefcase}
                label="Sub Domain"
                value={member.subdomain}
              />
            </div>
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
