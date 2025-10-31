import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },

    personalEmail: {
      type: String,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
      default: null,
    },

    // Profile Information
    profileImage: {
      type: String,
      default: null,
    },

    phoneNumber: {
      type: String,
      // required: [true, "Phone number is required"],
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"],
      default: null,
    },

    whatsappNumber: {
      type: String,
      // required: [true, "WhatsApp number is required"],
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit WhatsApp number"],
      default: null,
    },

    // College Information
    rollNumber: {
      type: Number,
      // required: [true, "Roll number is required"],
      trim: true,
      default: null,
      unique: true,
    },

    branch: {
      type: String,
      // required: [true, "Branch is required"],
      default: null,
    },

    year: {
      type: Number,
      // required: [true, "Year is required"],
      min: 1,
      max: 5,
      default: null,
    },

    vertical: {
      type: String,
      enum: [
        "Operations",
        "OTI",
        "OSG",
        "OCD",
        "OCC",
        "Public Relations",
        "Campus Ambassadors",
        "Academic & Internship Guidance",
        "Research & Publications",
        "Training Program",
        "Higher Studies",
        "Project Wing",
        "Event Management",
        null,
      ],
      default: null,
    },

    subdomain: {
      type: String,
      default: null,
    },

    specialRole: {
      type: String,
      enum: [
        "president",
        "vice-president",
        "general-secretary",
        "joint-secretary",
        "director",
        "deputy-director",
        "cto",
        "deputy-cto",
        "cso",
        "deputy-cso",
        "lead",
        "cco",
        "deputy-cco",
        null,
      ],
      default: null,
    },

    birthday: {
      type: Date,
      default: null,
    },

    role: {
      type: String,
      enum: ["admin", "member", "rec-man"],
      default: "member",
    },

    // Social Links (optional)
    socialLinks: {
      linkedin: String,
      github: String,
      instagram: String,
    },

    otherSocieties: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Create sparse unique indexes to allow multiple null values
// userSchema.index({ phoneNumber: 1 }, { unique: true, sparse: true });
// userSchema.index({ rollNumber: 1 }, { unique: true, sparse: true });

// // Composite index for better query performance
// userSchema.index({ department: 1, year: 1 });

// Method to get full name with roll number
userSchema.methods.getDisplayName = function () {
  return `${this.name} (${this.rollNumber})`;
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
