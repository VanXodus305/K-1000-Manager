"use client";

import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Select,
  SelectItem,
  Autocomplete,
  AutocompleteItem,
  Avatar,
  DatePicker,
  Checkbox,
} from "@heroui/react";
import { parseDate } from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";
import React, { useState, useEffect } from "react";
import { getFormOptions } from "@/actions/memberActions";
import { uploadImage, deleteImage } from "@/actions/imageActions";
import { FaUser, FaCamera } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { VERTICALS } from "@/constants/verticals";
import { useSession } from "next-auth/react";
import localFont from "next/font/local";

const conthrax = localFont({
  src: "../../../../public/fonts/Conthrax-SemiBold.otf",
  variable: "--font-conthrax",
  display: "swap",
});

export default function MemberProfileForm({ memberData, onSubmit, isLoading }) {
  const { data: session } = useSession();

  const [formData, setFormData] = useState({
    name: memberData?.name || "",
    email: memberData?.email || session?.user?.email || "",
    personalEmail: memberData?.personalEmail || "",
    rollNo: memberData?.rollNumber || "",
    year: memberData?.year || "",
    branch: memberData?.branch || "",
    vertical: memberData?.vertical || "",
    subdomain: memberData?.subdomain || "",
    phoneNumber: memberData?.phoneNumber || "",
    whatsappNumber: memberData?.whatsappNumber || "",
    birthday: memberData?.birthday || null,
    profileImage: memberData?.profileImage || null,
    socialLinks: memberData?.socialLinks || {
      linkedin: "",
      github: "",
      instagram: "",
    },
    otherSocieties: memberData?.otherSocieties?.join(", ") || "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    memberData?.profileImage || session?.user?.image || null
  );
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [errors, setErrors] = useState({});
  const [formOptions, setFormOptions] = useState({
    years: ["1st", "2nd", "3rd", "4th", "5th"],
    branches: [],
    verticals: VERTICALS,
    subdomains: [],
  });

  const [sameAsPhone, setSameAsPhone] = useState(
    memberData?.phoneNumber === memberData?.whatsappNumber &&
      memberData?.phoneNumber !== ""
  );

  // Fetch form options
  useEffect(() => {
    const fetchOptions = async () => {
      const result = await getFormOptions();
      if (result.success) {
        setFormOptions((prev) => ({
          ...prev,
          ...result.options,
        }));
      }
    };
    fetchOptions();
  }, []);

  // Auto-calculate year from roll number
  const calculateYearFromRollNo = (rollNo) => {
    if (!rollNo || rollNo.length < 2) return "";

    const yearPrefix = rollNo.substring(0, 2);
    const currentYear = new Date().getFullYear() % 100;
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

  const validateEmail = (email) => {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (number) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(number);
  };

  const validateRollNumber = (rollNo) => {
    const rollNoRegex = /^[0-9]+$/;
    return rollNoRegex.test(rollNo);
  };

  const validateURL = (url) => {
    if (!url) return true;
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === "http:" || urlObj.protocol === "https:";
    } catch (e) {
      return false;
    }
  };

  const handleChange = (field, value) => {
    let newFormData = { ...formData, [field]: value };

    if (field === "rollNo") {
      const numericValue = value.replace(/[^0-9]/g, "");
      newFormData[field] = numericValue;

      const calculatedYear = calculateYearFromRollNo(numericValue);
      if (calculatedYear) {
        newFormData.year = calculatedYear;
      }

      if (numericValue && !validateRollNumber(numericValue)) {
        setErrors((prev) => ({
          ...prev,
          rollNo: "Roll number must contain only digits",
        }));
      } else {
        setErrors((prev) => ({ ...prev, rollNo: null }));
      }
    }

    if (field === "email") {
      if (value && !validateEmail(value)) {
        setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
      } else {
        setErrors((prev) => ({ ...prev, email: null }));
      }
    }

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

    if (field === "phoneNumber") {
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

      if (sameAsPhone) {
        newFormData.whatsappNumber = numericValue;
      }
    }

    if (field === "whatsappNumber") {
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
    setImagePreview(memberData?.profileImage || session?.user?.image || null);
    setErrors((prev) => ({ ...prev, image: null }));
  };

  const handleSubmit = async () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (formData.email && !validateEmail(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.rollNo) newErrors.rollNo = "Roll number is required";
    if (formData.rollNo && !validateRollNumber(formData.rollNo))
      newErrors.rollNo = "Roll number must contain only digits";
    if (!formData.year) newErrors.year = "Year is required";
    if (!formData.branch) newErrors.branch = "Branch is required";
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
                  memberData?.profileImage &&
                  memberData.profileImage !== profileImageUrl
                ) {
                  await deleteImage(memberData.profileImage);
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

      const societies = formData.otherSocieties
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== "");

      await onSubmit({
        ...formData,
        otherSocieties: societies,
        profileImage: profileImageUrl,
      });
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
      formData.branch &&
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
    <I18nProvider locale="en-GB">
      <div className="min-h-screen bg-gradient-to-br from-background-100 to-background-200 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1
              className={`${conthrax.className} text-4xl font-bold text-foreground mb-2`}
            >
              Complete Your Profile
            </h1>
            <p className="text-foreground/60">
              Please fill in your details to get started
            </p>
          </div>

          {/* Profile Card */}
          <Card className="bg-background-200/50 backdrop-blur-md border border-primary/30 shadow-lg">
            <CardBody className="gap-6 p-6">
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
              <div>
                <h3 className="text-lg font-semibold text-primary mb-4">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    placeholder="Your name"
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
                    label="Email Address"
                    placeholder="Your email"
                    value={formData.email}
                    isReadOnly
                    classNames={{
                      label: "text-foreground/80",
                      input: "text-foreground",
                      inputWrapper:
                        "bg-background-200/60 border border-primary/20",
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Input
                    label="Personal Email"
                    placeholder="Enter personal email (optional)"
                    value={formData.personalEmail}
                    onValueChange={(value) =>
                      handleChange("personalEmail", value)
                    }
                    isInvalid={!!errors.personalEmail}
                    errorMessage={errors.personalEmail}
                    classNames={{
                      label: "text-foreground/80",
                      input: "text-foreground",
                      inputWrapper:
                        "bg-background-200/60 border border-primary/20 hover:border-primary/40 focus-within:border-primary",
                    }}
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
              </div>

              {/* Academic Information */}
              <div>
                <h3 className="text-lg font-semibold text-primary mb-4">
                  Academic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Year"
                    placeholder="Enter your academic year"
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
                    placeholder="Select branch"
                    defaultItems={formOptions.branches.map((branch) => ({
                      label: branch,
                      value: branch,
                    }))}
                    selectedKey={formData.branch || null}
                    inputValue={formData.branch || ""}
                    onSelectionChange={(value) => {
                      if (value) {
                        handleChange("branch", value);
                      }
                    }}
                    onInputChange={(value) => {
                      handleChange("branch", value);
                    }}
                    allowsCustomValue
                    isInvalid={!!errors.branch}
                    errorMessage={errors.branch}
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
              </div>

              {/* K-1000 Information */}
              <div>
                <h3 className="text-lg font-semibold text-primary mb-4">
                  K-1000 Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Vertical / Team"
                    placeholder="Select vertical"
                    selectedKeys={formData.vertical ? [formData.vertical] : []}
                    onSelectionChange={(keys) => {
                      const value = Array.from(keys)[0];
                      handleChange("vertical", value);
                    }}
                    isInvalid={!!errors.vertical}
                    errorMessage={errors.vertical}
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
              </div>

              {/* Birthday */}
              <div>
                <h3 className="text-lg font-semibold text-primary mb-4">
                  Additional Information
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <DatePicker
                    label="Birthday"
                    color="primary"
                    variant="bordered"
                    placeholder="Select birthday (optional)"
                    maxValue={parseDate(new Date().toISOString().split("T")[0])}
                    showMonthAndYearPickers
                    value={
                      formData.birthday
                        ? parseDate(
                            new Date(formData.birthday)
                              .toISOString()
                              .split("T")[0]
                          )
                        : null
                    }
                    onChange={(date) => {
                      if (date) {
                        const paddedMonth = String(date.month).padStart(2, "0");
                        const paddedDay = String(date.day).padStart(2, "0");
                        const isoString = `${date.year}-${paddedMonth}-${paddedDay}T00:00:00.000Z`;
                        handleChange("birthday", isoString);
                      } else {
                        handleChange("birthday", null);
                      }
                    }}
                    calendarProps={{
                      classNames: {
                        cellButton:
                          "data-[hover=true]:bg-primary/20 data-[hover=true]:text-foreground",
                      },
                    }}
                    classNames={{
                      label: "text-foreground/80",
                      inputWrapper:
                        "border border-primary/20 hover:border-primary/40 bg-background-200/60 focus-within:border-primary",
                      segment:
                        "data-[editable=true]:bg-transparent text-primary",
                      popoverContent: "border border-primary/30",
                    }}
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-primary mb-4">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Phone Number"
                    placeholder="Enter 10-digit phone number"
                    value={formData.phoneNumber}
                    onValueChange={(value) =>
                      handleChange("phoneNumber", value)
                    }
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
              </div>

              {/* Social Links */}
              <div>
                <h3 className="text-lg font-semibold text-primary mb-4">
                  Social Links
                </h3>
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
              </div>

              {/* Other Societies */}
              <div>
                <Input
                  label="Other Societies"
                  placeholder="Enter societies separated by commas (optional)"
                  value={formData.otherSocieties}
                  onValueChange={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      otherSocieties: value,
                    }));
                  }}
                  classNames={{
                    label: "text-foreground/80",
                    input: "text-foreground",
                    inputWrapper:
                      "bg-background-200/60 border border-primary/20 hover:border-primary/40 focus-within:border-primary",
                  }}
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 mt-8">
                <Button
                  fullWidth
                  color="primary"
                  size="lg"
                  onPress={handleSubmit}
                  isDisabled={!isFormValid() || isLoading || isUploadingImage}
                  isLoading={isLoading || isUploadingImage}
                  className="bg-primary text-background-200 font-semibold hover:bg-primary/90"
                >
                  {isUploadingImage
                    ? "Uploading Photo..."
                    : isLoading
                    ? "Saving..."
                    : "Save Profile"}
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </I18nProvider>
  );
}
