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
  Checkbox,
  Autocomplete,
  AutocompleteItem,
  Avatar,
} from "@heroui/react";
import React, { useState, useEffect } from "react";
import { getFormOptions } from "@/actions/memberActions";
import { uploadImage, deleteImage } from "@/actions/imageActions";
import { FaUser, FaCamera } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export default function MemberFormModal({
  isOpen,
  onClose,
  onSave,
  member = null,
  mode = "add",
  isLoading = false,
}) {
  const [formData, setFormData] = useState(
    member || {
      name: "",
      email: "",
      personalEmail: "",
      rollNo: "",
      year: "",
      branch: "",
      vertical: "",
      subdomain: "",
      phoneNumber: "",
      whatsappNumber: "",
      specialRole: null,
      socialLinks: {
        linkedin: "",
        github: "",
        instagram: "",
      },
      otherSocieties: [],
    }
  );

  const [sameAsPhone, setSameAsPhone] = useState(false);
  const [errors, setErrors] = useState({});
  const [otherSocietiesInput, setOtherSocietiesInput] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [formOptions, setFormOptions] = useState({
    years: ["1st", "2nd", "3rd", "4th", "5th"],
    branches: [],
    verticals: [
      "Operations",
      "OTI",
      "OSG",
      "OCD",
      "Public Relations",
      "Campus Ambassadors",
      "Academic & Internship Guidance",
      "Research & Publications",
      "Training Program",
      "Higher Studies",
      "Project Wing",
      "Event Management",
    ],
    subdomains: [],
    specialRoles: [
      { key: "president", label: "President" },
      { key: "vice-president", label: "Vice President" },
      { key: "general-secretary", label: "General Secretary" },
      { key: "joint-secretary", label: "Joint Secretary" },
      { key: "director", label: "Director" },
      { key: "deputy-director", label: "Deputy Director" },
      { key: "cto", label: "CTO" },
      { key: "deputy-cto", label: "Deputy CTO" },
      { key: "cso", label: "CSO" },
      { key: "deputy-cso", label: "Deputy CSO" },
      { key: "lead", label: "Lead" },
      { key: "cco", label: "CCO" },
      { key: "deputy-cco", label: "Deputy CCO" },
    ],
  });

  // Fetch form options from database
  useEffect(() => {
    const fetchOptions = async () => {
      const result = await getFormOptions();
      if (result.success) {
        // Merge with existing specialRoles
        setFormOptions((prev) => ({
          ...prev,
          ...result.options,
        }));
      }
    };

    if (isOpen) {
      fetchOptions();
    }
  }, [isOpen]);

  // Update formData when member changes
  React.useEffect(() => {
    if (member) {
      setFormData(member);
      // Set other societies input
      setOtherSocietiesInput(
        Array.isArray(member.otherSocieties)
          ? member.otherSocieties.join(", ")
          : ""
      );
      // Set profile image preview
      setImagePreview(member.profileImage || null);
      setProfileImage(null);
      // Check if whatsapp and phone are same
      setSameAsPhone(
        member.phoneNumber === member.whatsappNumber &&
          member.phoneNumber !== ""
      );
    } else {
      setFormData({
        name: "",
        email: "",
        personalEmail: "",
        rollNo: "",
        year: "",
        branch: "",
        vertical: "",
        subdomain: "",
        phoneNumber: "",
        whatsappNumber: "",
        specialRole: null,
        socialLinks: {
          linkedin: "",
          github: "",
          instagram: "",
        },
        otherSocieties: [],
      });
      setOtherSocietiesInput("");
      setImagePreview(null);
      setProfileImage(null);
      setSameAsPhone(false);
    }
    setErrors({});
  }, [member, isOpen]);

  // Auto-calculate year from roll number
  const calculateYearFromRollNo = (rollNo) => {
    if (!rollNo || rollNo.length < 2) return "";

    const yearPrefix = rollNo.substring(0, 2);
    const currentYear = new Date().getFullYear() % 100; // Get last 2 digits of current year

    const yearDiff = currentYear - parseInt(yearPrefix);

    if (yearDiff >= 0 && yearDiff < 5) {
      const yearNumber = yearDiff + 1;
      if (yearNumber === 1) return "1st";
      if (yearNumber === 2) return "2nd";
      if (yearNumber === 3) return "3rd";
      if (yearNumber === 4) return "4th";
      if (yearNumber === 5) return "5th";
    }
    return "";
  };

  // Auto-generate email from roll number
  const generateEmailFromRollNo = (rollNo) => {
    if (!rollNo) return "";
    return `${rollNo}@kiit.ac.in`;
  };

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (number) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(number);
  };

  const validateRollNumber = (rollNo) => {
    // Roll number should be numeric only
    const rollNoRegex = /^[0-9]+$/;
    return rollNoRegex.test(rollNo);
  };

  const validateURL = (url) => {
    if (!url) return true; // Empty is valid (optional field)
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === "http:" || urlObj.protocol === "https:";
    } catch (e) {
      return false;
    }
  };

  const handleChange = (field, value) => {
    let newFormData = { ...formData, [field]: value };

    // Special handling for roll number
    if (field === "rollNo") {
      // Only allow numbers
      const numericValue = value.replace(/[^0-9]/g, "");
      newFormData[field] = numericValue;

      // Auto-calculate year
      const calculatedYear = calculateYearFromRollNo(numericValue);
      if (calculatedYear) {
        newFormData.year = calculatedYear;
      }

      // Auto-generate email
      newFormData.email = generateEmailFromRollNo(numericValue);

      // Validate roll number
      if (numericValue && !validateRollNumber(numericValue)) {
        setErrors((prev) => ({
          ...prev,
          rollNo: "Roll number must contain only digits",
        }));
      } else {
        setErrors((prev) => ({ ...prev, rollNo: null }));
      }
    }

    // Validate email
    if (field === "email") {
      if (value && !validateEmail(value)) {
        setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
      } else {
        setErrors((prev) => ({ ...prev, email: null }));
      }
    }

    // Validate personal email
    if (field === "personalEmail") {
      if (value && !validateEmail(value)) {
        setErrors((prev) => ({
          ...prev,
          personalEmail: "Invalid email format",
        }));
      } else {
        setErrors((prev) => ({ ...prev, personalEmail: null }));
      }
    }

    // Validate phone number
    if (field === "phoneNumber") {
      // Only allow numbers
      const numericValue = value.replace(/[^0-9]/g, "");
      newFormData[field] = numericValue;

      if (numericValue && !validatePhoneNumber(numericValue)) {
        setErrors((prev) => ({
          ...prev,
          phoneNumber: "Phone number must be 10 digits",
        }));
      } else {
        setErrors((prev) => ({ ...prev, phoneNumber: null }));
      }

      // If same as phone is checked, update whatsapp number
      if (sameAsPhone) {
        newFormData.whatsappNumber = numericValue;
      }
    }

    // Validate whatsapp number
    if (field === "whatsappNumber") {
      // Only allow numbers
      const numericValue = value.replace(/[^0-9]/g, "");
      newFormData[field] = numericValue;

      if (numericValue && !validatePhoneNumber(numericValue)) {
        setErrors((prev) => ({
          ...prev,
          whatsappNumber: "WhatsApp number must be 10 digits",
        }));
      } else {
        setErrors((prev) => ({ ...prev, whatsappNumber: null }));
      }
    }

    setFormData(newFormData);
  };

  const handleSameAsPhoneChange = (checked) => {
    setSameAsPhone(checked);
    if (checked) {
      setFormData((prev) => ({ ...prev, whatsappNumber: prev.phoneNumber }));
      // Clear whatsapp error if phone is valid
      if (formData.phoneNumber && validatePhoneNumber(formData.phoneNumber)) {
        setErrors((prev) => ({ ...prev, whatsappNumber: null }));
      }
    }
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, image: "Please select an image file" }));
      return;
    }

    setProfileImage(file);
    setErrors((prev) => ({ ...prev, image: null }));

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setProfileImage(null);
    setImagePreview(member?.profileImage || null);
    setErrors((prev) => ({ ...prev, image: null }));
  };

  const handleSubmit = async () => {
    // Final validation before submit
    const newErrors = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "KIIT Email is required";
    if (formData.email && !validateEmail(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.rollNo) newErrors.rollNo = "Roll number is required";
    if (formData.rollNo && !validateRollNumber(formData.rollNo))
      newErrors.rollNo = "Roll number must contain only digits";
    if (!formData.year) newErrors.year = "Year is required";
    if (!formData.vertical) newErrors.vertical = "Vertical is required";

    if (formData.personalEmail && !validateEmail(formData.personalEmail)) {
      newErrors.personalEmail = "Invalid email format";
    }
    if (formData.phoneNumber && !validatePhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits";
    }
    if (
      formData.whatsappNumber &&
      !validatePhoneNumber(formData.whatsappNumber)
    ) {
      newErrors.whatsappNumber = "WhatsApp number must be 10 digits";
    }

    // Validate social links URLs
    if (
      formData.socialLinks?.linkedin &&
      !validateURL(formData.socialLinks.linkedin)
    ) {
      newErrors.linkedin = "Please enter a valid URL";
    }
    if (
      formData.socialLinks?.github &&
      !validateURL(formData.socialLinks.github)
    ) {
      newErrors.github = "Please enter a valid URL";
    }
    if (
      formData.socialLinks?.instagram &&
      !validateURL(formData.socialLinks.instagram)
    ) {
      newErrors.instagram = "Please enter a valid URL";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsUploadingImage(true);

    try {
      // Upload image to Cloudinary if new image is selected
      let profileImageUrl = formData.profileImage || null;

      if (profileImage) {
        const reader = new FileReader();
        reader.readAsDataURL(profileImage);

        await new Promise((resolve, reject) => {
          reader.onload = async () => {
            try {
              const base64Image = reader.result;
              const uploadResult = await uploadImage(base64Image);

              if (uploadResult.success) {
                profileImageUrl = uploadResult.url;

                // Delete old image if updating
                if (
                  member?.profileImage &&
                  member.profileImage !== profileImageUrl
                ) {
                  await deleteImage(member.profileImage);
                }

                resolve();
              } else {
                setErrors((prev) => ({
                  ...prev,
                  image: uploadResult.error || "Failed to upload image",
                }));
                reject(new Error(uploadResult.error));
              }
            } catch (error) {
              setErrors((prev) => ({
                ...prev,
                image: "Failed to upload image",
              }));
              reject(error);
            }
          };
          reader.onerror = reject;
        });
      }

      // Process other societies before saving
      const societies = otherSocietiesInput
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== "");

      onSave({
        ...formData,
        otherSocieties: societies,
        profileImage: profileImageUrl,
      });
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.name &&
      formData.email &&
      formData.rollNo &&
      formData.year &&
      formData.vertical &&
      !errors.email &&
      !errors.rollNo &&
      !errors.phoneNumber &&
      !errors.whatsappNumber &&
      !errors.personalEmail &&
      !errors.linkedin &&
      !errors.github &&
      !errors.instagram
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      backdrop="blur"
      size="3xl"
      scrollBehavior="inside"
      classNames={{
        base: "bg-background-200/95 backdrop-blur-md border border-primary/30 max-h-[90vh]",
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
          <div className="flex flex-col gap-4">
            {/* Profile Picture Upload */}
            <div className="flex flex-col items-center gap-4 p-4 bg-background-100/30 rounded-lg border border-primary/10">
              <div className="relative">
                <Avatar
                  src={imagePreview}
                  icon={<FaUser size={48} />}
                  name={formData.name}
                  className="w-32 h-32"
                  color="primary"
                  classNames={{
                    base: "shrink-0 border-2 border-primary/30 shadow-lg shadow-primary/50",
                    icon: "text-foreground/80",
                  }}
                />
                {imagePreview && profileImage && (
                  <Button
                    isIconOnly
                    size="sm"
                    color="danger"
                    className="absolute -top-1 -right-1 min-w-6 h-6"
                    onPress={handleRemoveImage}
                  >
                    <MdDelete size={16} />
                  </Button>
                )}
              </div>
              <div className="flex flex-col items-center gap-2">
                <label htmlFor="profile-image" className="cursor-pointer">
                  <Button
                    as="span"
                    color="primary"
                    variant="flat"
                    startContent={<FaCamera />}
                    className="bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30"
                  >
                    {imagePreview ? "Change Photo" : "Upload Photo"}
                  </Button>
                </label>
                <input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {errors.image && (
                  <p className="text-xs text-danger">{errors.image}</p>
                )}
                <p className="text-xs text-foreground/50">
                  Supported formats: JPG, PNG, GIF, WebP
                </p>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                placeholder="Enter full name"
                value={formData.name}
                onValueChange={(value) => handleChange("name", value)}
                isInvalid={!!errors.name}
                errorMessage={errors.name}
                classNames={{
                  label: "text-foreground/80",
                  input: "text-foreground",
                  inputWrapper:
                    "bg-background-200/60 border border-primary/20 hover:border-primary/40 focus-within:border-primary",
                }}
                isRequired
              />

              <Input
                label="Roll Number"
                placeholder="Enter roll number"
                value={formData.rollNo}
                onValueChange={(value) => handleChange("rollNo", value)}
                isInvalid={!!errors.rollNo}
                errorMessage={errors.rollNo}
                classNames={{
                  label: "text-foreground/80",
                  input: "text-foreground",
                  inputWrapper:
                    "bg-background-200/60 border border-primary/20 hover:border-primary/40 focus-within:border-primary",
                }}
                isRequired
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="KIIT Email"
                placeholder="Auto-generated from roll number"
                value={formData.email}
                onValueChange={(value) => handleChange("email", value)}
                isInvalid={!!errors.email}
                errorMessage={errors.email}
                classNames={{
                  label: "text-foreground/80",
                  input: "text-foreground",
                  inputWrapper:
                    "bg-background-200/60 border border-primary/20 hover:border-primary/40 focus-within:border-primary",
                }}
                isRequired
              />

              <Input
                label="Personal Email"
                placeholder="Enter personal email (optional)"
                value={formData.personalEmail}
                onValueChange={(value) => handleChange("personalEmail", value)}
                isInvalid={!!errors.personalEmail}
                errorMessage={errors.personalEmail}
                classNames={{
                  label: "text-foreground/80",
                  input: "text-foreground",
                  inputWrapper:
                    "bg-background-200/60 border border-primary/20 hover:border-primary/40 focus-within:border-primary",
                }}
              />
            </div>

            {/* Academic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Year"
                placeholder="Auto-calculated from roll number"
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
                {formOptions.years.map((year) => (
                  <SelectItem
                    key={year}
                    value={year}
                    color="primary"
                    variant="flat"
                  >
                    {year}
                  </SelectItem>
                ))}
              </Select>

              <Autocomplete
                label="Branch"
                placeholder="Select or enter branch (optional)"
                defaultItems={formOptions.branches.map((branch) => ({
                  label: branch,
                  value: branch,
                }))}
                selectedKey={formData.branch || null}
                inputValue={formData.branch || ""}
                onSelectionChange={(value) => {
                  // This fires when selecting from dropdown
                  if (value) {
                    handleChange("branch", value);
                  }
                }}
                onInputChange={(value) => {
                  // This fires when typing custom value
                  handleChange("branch", value);
                }}
                allowsCustomValue
                classNames={{
                  base: "w-full",
                  listboxWrapper: "max-h-[200px]",
                  selectorButton: "text-foreground/80",
                  popoverContent:
                    "bg-background-200/95 backdrop-blur-md border border-primary/30",
                }}
                inputProps={{
                  classNames: {
                    label: "text-foreground/80",
                    input: "text-foreground",
                    inputWrapper:
                      "bg-background-200/60 border border-primary/20 hover:border-primary/40 data-[hover=true]:bg-background-200/80",
                  },
                }}
              >
                {(item) => (
                  <AutocompleteItem
                    color="primary"
                    variant="flat"
                    key={item.value}
                    value={item.value}
                  >
                    {item.label}
                  </AutocompleteItem>
                )}
              </Autocomplete>
            </div>

            {/* K-1000 Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Vertical / Team"
                placeholder="Select vertical"
                selectedKeys={formData.vertical ? [formData.vertical] : []}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0];
                  handleChange("vertical", value);
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
                {formOptions.verticals.map((vertical) => (
                  <SelectItem
                    key={vertical}
                    value={vertical}
                    color="primary"
                    variant="flat"
                  >
                    {vertical}
                  </SelectItem>
                ))}
              </Select>

              <Autocomplete
                label="Sub Domain"
                placeholder="Select or enter subdomain (optional)"
                defaultItems={formOptions.subdomains.map((subdomain) => ({
                  label: subdomain,
                  value: subdomain,
                }))}
                selectedKey={formData.subdomain || null}
                inputValue={formData.subdomain || ""}
                onSelectionChange={(value) => {
                  if (value) {
                    handleChange("subdomain", value);
                  }
                }}
                onInputChange={(value) => {
                  handleChange("subdomain", value);
                }}
                allowsCustomValue
                classNames={{
                  base: "w-full",
                  listboxWrapper: "max-h-[200px]",
                  selectorButton: "text-foreground/80",
                  popoverContent:
                    "bg-background-200/95 backdrop-blur-md border border-primary/30",
                }}
                inputProps={{
                  classNames: {
                    label: "text-foreground/80",
                    input: "text-foreground",
                    inputWrapper:
                      "bg-background-200/60 border border-primary/20 hover:border-primary/40 data-[hover=true]:bg-background-200/80",
                  },
                }}
              >
                {(item) => (
                  <AutocompleteItem
                    color="primary"
                    variant="flat"
                    key={item.value}
                    value={item.value}
                  >
                    {item.label}
                  </AutocompleteItem>
                )}
              </Autocomplete>
            </div>

            {/* Special Role */}
            <div className="grid grid-cols-1 gap-4">
              <Select
                label="Special Role"
                placeholder="Select special role (optional)"
                selectedKeys={
                  formData.specialRole ? [formData.specialRole] : []
                }
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0];
                  handleChange("specialRole", value || null);
                }}
                classNames={{
                  label: "text-foreground/80",
                  trigger:
                    "bg-background-200/60 border border-primary/20 hover:border-primary/40 data-[hover=true]:bg-background-200/80",
                  value: "text-foreground",
                  popoverContent:
                    "bg-background-200/95 backdrop-blur-md border border-primary/30",
                }}
              >
                {formOptions.specialRoles.map((role) => (
                  <SelectItem
                    key={role.key}
                    value={role.key}
                    color="primary"
                    variant="flat"
                  >
                    {role.label}
                  </SelectItem>
                ))}
              </Select>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Phone Number"
                placeholder="Enter 10-digit phone number"
                value={formData.phoneNumber}
                onValueChange={(value) => handleChange("phoneNumber", value)}
                isInvalid={!!errors.phoneNumber}
                errorMessage={errors.phoneNumber}
                maxLength={10}
                classNames={{
                  label: "text-foreground/80",
                  input: "text-foreground",
                  inputWrapper:
                    "bg-background-200/60 border border-primary/20 hover:border-primary/40 focus-within:border-primary",
                }}
              />

              <div className="flex flex-col gap-2">
                <Input
                  label="WhatsApp Number"
                  placeholder="Enter 10-digit WhatsApp number"
                  value={formData.whatsappNumber}
                  onValueChange={(value) =>
                    handleChange("whatsappNumber", value)
                  }
                  isInvalid={!!errors.whatsappNumber}
                  errorMessage={errors.whatsappNumber}
                  maxLength={10}
                  isDisabled={sameAsPhone}
                  classNames={{
                    label: "text-foreground/80",
                    input: "text-foreground",
                    inputWrapper:
                      "bg-background-200/60 border border-primary/20 hover:border-primary/40 focus-within:border-primary",
                  }}
                />
                <Checkbox
                  size="sm"
                  isSelected={sameAsPhone}
                  color="primary"
                  onValueChange={handleSameAsPhoneChange}
                  classNames={{
                    label: "text-xs text-foreground/80",
                    wrapper:
                      "after:border-background-200 before:border-primary",
                  }}
                >
                  Same as phone number
                </Checkbox>
              </div>
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="LinkedIn"
                placeholder="LinkedIn profile URL"
                value={formData.socialLinks?.linkedin || ""}
                onValueChange={(value) => {
                  setFormData((prev) => ({
                    ...prev,
                    socialLinks: { ...prev.socialLinks, linkedin: value },
                  }));
                  // Validate URL
                  if (value && !validateURL(value)) {
                    setErrors((prev) => ({
                      ...prev,
                      linkedin: "Please enter a valid URL",
                    }));
                  } else {
                    setErrors((prev) => ({ ...prev, linkedin: null }));
                  }
                }}
                isInvalid={!!errors.linkedin}
                errorMessage={errors.linkedin}
                classNames={{
                  label: "text-foreground/80",
                  input: "text-foreground",
                  inputWrapper:
                    "bg-background-200/60 border border-primary/20 hover:border-primary/40 focus-within:border-primary",
                }}
              />

              <Input
                label="GitHub"
                placeholder="GitHub profile URL"
                value={formData.socialLinks?.github || ""}
                onValueChange={(value) => {
                  setFormData((prev) => ({
                    ...prev,
                    socialLinks: { ...prev.socialLinks, github: value },
                  }));
                  // Validate URL
                  if (value && !validateURL(value)) {
                    setErrors((prev) => ({
                      ...prev,
                      github: "Please enter a valid URL",
                    }));
                  } else {
                    setErrors((prev) => ({ ...prev, github: null }));
                  }
                }}
                isInvalid={!!errors.github}
                errorMessage={errors.github}
                classNames={{
                  label: "text-foreground/80",
                  input: "text-foreground",
                  inputWrapper:
                    "bg-background-200/60 border border-primary/20 hover:border-primary/40 focus-within:border-primary",
                }}
              />

              <Input
                label="Instagram"
                placeholder="Instagram profile URL"
                value={formData.socialLinks?.instagram || ""}
                onValueChange={(value) => {
                  setFormData((prev) => ({
                    ...prev,
                    socialLinks: { ...prev.socialLinks, instagram: value },
                  }));
                  // Validate URL
                  if (value && !validateURL(value)) {
                    setErrors((prev) => ({
                      ...prev,
                      instagram: "Please enter a valid URL",
                    }));
                  } else {
                    setErrors((prev) => ({ ...prev, instagram: null }));
                  }
                }}
                isInvalid={!!errors.instagram}
                errorMessage={errors.instagram}
                classNames={{
                  label: "text-foreground/80",
                  input: "text-foreground",
                  inputWrapper:
                    "bg-background-200/60 border border-primary/20 hover:border-primary/40 focus-within:border-primary",
                }}
              />
            </div>

            {/* Other Societies */}
            <Input
              label="Other Societies"
              placeholder="Enter societies separated by commas (e.g., Society1, Society2)"
              value={otherSocietiesInput}
              onValueChange={(value) => {
                setOtherSocietiesInput(value);
              }}
              classNames={{
                label: "text-foreground/80",
                input: "text-foreground",
                inputWrapper:
                  "bg-background-200/60 border border-primary/20 hover:border-primary/40 focus-within:border-primary",
              }}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            variant="flat"
            onPress={onClose}
            isDisabled={isLoading || isUploadingImage}
            className="bg-danger/20 text-danger border border-danger/30 hover:bg-danger/30"
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            isDisabled={!isFormValid() || isLoading || isUploadingImage}
            isLoading={isLoading || isUploadingImage}
            className="bg-primary text-background-200 font-semibold hover:bg-primary/90"
          >
            {isUploadingImage
              ? "Uploading..."
              : mode === "add"
              ? "Add Member"
              : "Save Changes"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
