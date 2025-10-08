"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { useState } from "react";
import {
  yearOptions,
  branchOptions,
  k1kBranchOptions,
  domainOptions,
} from "@/lib/dummyData";

export default function MemberFormModal({
  isOpen,
  onClose,
  onSave,
  member = null,
  mode = "add",
}) {
  const [formData, setFormData] = useState(
    member || {
      name: "",
      year: "",
      branch: "",
      rollNo: "",
      k1kBranch: "",
      domain: "",
    }
  );

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  const isFormValid = () => {
    return (
      formData.name &&
      formData.year &&
      formData.branch &&
      formData.rollNo &&
      formData.k1kBranch &&
      formData.domain
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      backdrop="blur"
      size="2xl"
      classNames={{
        base: "bg-background-200/95 backdrop-blur-md border border-primary/30",
        header: "border-b border-primary/20",
        body: "py-6",
        footer: "border-t border-primary/20",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-foreground">
            {mode === "add" ? "Add New Member" : "Edit Member"}
          </h2>
          <p className="text-sm text-foreground/60">
            {mode === "add"
              ? "Fill in the details to add a new member"
              : "Update the member information"}
          </p>
        </ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              placeholder="Enter full name"
              value={formData.name}
              onValueChange={(value) => handleChange("name", value)}
              classNames={{
                label: "text-foreground/80",
                input: "text-foreground",
                inputWrapper:
                  "bg-background-200/60 border border-primary/20 hover:border-primary/40 focus-within:border-primary",
              }}
              isRequired
            />

            <Select
              label="Year"
              placeholder="Select year"
              selectedKeys={formData.year ? [formData.year] : []}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0];
                handleChange("year", value);
              }}
              classNames={{
                label: "text-foreground/80",
                trigger:
                  "bg-background-200/60 border border-primary/20 hover:border-primary/40 data-[hover=true]:bg-background-200/80",
                value: "text-foreground",
                popoverContent:
                  "bg-background-200/95 backdrop-blur-md border border-primary/30",
              }}
              isRequired
            >
              {yearOptions.map((year) => (
                <SelectItem
                  key={year}
                  value={year}
                  className="text-foreground hover:bg-primary/20"
                >
                  {year}
                </SelectItem>
              ))}
            </Select>

            <Select
              label="Branch"
              placeholder="Select branch"
              selectedKeys={formData.branch ? [formData.branch] : []}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0];
                handleChange("branch", value);
              }}
              classNames={{
                label: "text-foreground/80",
                trigger:
                  "bg-background-200/60 border border-primary/20 hover:border-primary/40 data-[hover=true]:bg-background-200/80",
                value: "text-foreground",
                popoverContent:
                  "bg-background-200/95 backdrop-blur-md border border-primary/30",
              }}
              isRequired
            >
              {branchOptions.map((branch) => (
                <SelectItem
                  key={branch}
                  value={branch}
                  className="text-foreground hover:bg-primary/20"
                >
                  {branch}
                </SelectItem>
              ))}
            </Select>

            <Input
              label="Roll Number"
              placeholder="Enter roll number"
              value={formData.rollNo}
              onValueChange={(value) => handleChange("rollNo", value)}
              classNames={{
                label: "text-foreground/80",
                input: "text-foreground",
                inputWrapper:
                  "bg-background-200/60 border border-primary/20 hover:border-primary/40 focus-within:border-primary",
              }}
              isRequired
            />

            <Select
              label="K1K Branch"
              placeholder="Select K1K branch"
              selectedKeys={formData.k1kBranch ? [formData.k1kBranch] : []}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0];
                handleChange("k1kBranch", value);
              }}
              classNames={{
                label: "text-foreground/80",
                trigger:
                  "bg-background-200/60 border border-primary/20 hover:border-primary/40 data-[hover=true]:bg-background-200/80",
                value: "text-foreground",
                popoverContent:
                  "bg-background-200/95 backdrop-blur-md border border-primary/30",
              }}
              isRequired
            >
              {k1kBranchOptions.map((k1kBranch) => (
                <SelectItem
                  key={k1kBranch}
                  value={k1kBranch}
                  className="text-foreground hover:bg-primary/20"
                >
                  {k1kBranch}
                </SelectItem>
              ))}
            </Select>

            <Select
              label="Domain"
              placeholder="Select domain"
              selectedKeys={formData.domain ? [formData.domain] : []}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0];
                handleChange("domain", value);
              }}
              classNames={{
                label: "text-foreground/80",
                trigger:
                  "bg-background-200/60 border border-primary/20 hover:border-primary/40 data-[hover=true]:bg-background-200/80",
                value: "text-foreground",
                popoverContent:
                  "bg-background-200/95 backdrop-blur-md border border-primary/30",
              }}
              isRequired
            >
              {domainOptions.map((domain) => (
                <SelectItem
                  key={domain}
                  value={domain}
                  className="text-foreground hover:bg-primary/20"
                >
                  {domain}
                </SelectItem>
              ))}
            </Select>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            variant="flat"
            onPress={onClose}
            className="bg-danger/20 text-danger border border-danger/30 hover:bg-danger/30"
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            isDisabled={!isFormValid()}
            className="bg-primary text-background-200 font-semibold hover:bg-primary/90"
          >
            {mode === "add" ? "Add Member" : "Save Changes"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
