// lib/models/User.js
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

		// Profile Information
		profileImage: {
			type: String,
			default: null,
		},

		phoneNumber: {
			type: String,
			// required: [true, "Phone number is required"],
			unique: true,
			match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"],
			default: null,
		},

		// College Information
		rollNumber: {
			type: String,
			// required: [true, "Roll number is required"],
			unique: true,
			uppercase: true,
			trim: true,
			default: null,
		},

		department: {
			type: String,
			// required: [true, "Department is required"],
			trim: true,
			default: null,
		},

		year: {
			type: Number,
			// required: [true, "Year is required"],
			min: 1,
			max: 5,
			default: null,
		},

		role: {
			type: String,
			enum: ["admin", "member", "director", "deputy-director"],
			default: "member",
		},

		// Society Information
		joiningDate: {
			type: Date,
			// required: [true, "Joining date is required"],
			default: null,
		},

		// Social Links (optional)
		socialLinks: {
			linkedin: String,
			github: String,
			instagram: String,
		},
	},
	{
		timestamps: true, // Adds createdAt and updatedAt
	},
);

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ rollNumber: 1 });
userSchema.index({ phoneNumber: 1 });
userSchema.index({ department: 1, year: 1 });

// Method to get full name with roll number
userSchema.methods.getDisplayName = function () {
	return `${this.name} (${this.rollNumber})`;
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
