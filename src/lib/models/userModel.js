// lib/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minlength: [2, "Name must be at least 2 characters"],
    maxlength: [50, "Name cannot exceed 50 characters"]
  },
  
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email"
    ]
  },
  
  phoneNumber: {
    type: String,
    required: [true, "Phone number is required"],
    unique: true,
    match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"]
  },
  
  // College Information
  rollNumber: {
    type: String,
    required: [true, "Roll number is required"],
    unique: true,
    uppercase: true,
    trim: true
  },
  
  department: {
    type: String,
    required: [true, "Department is required"],
    trim: true
  },
  
  year: {
    type: Number,
    required: [true, "Year is required"],
    min: 1,
    max: 4
  },
  
  semester: {
    type: Number,
    required: [true, "Semester is required"],
    min: 1,
    max: 8
  },
  
  // Society Information
  joiningDate: {
    type: Date,
    required: [true, "Joining date is required"],
    default: Date.now
  },
  
  // Profile Information
  profileImage: {
    type: String,
    default: null
  },
  
  bio: {
    type: String,
    maxlength: [200, "Bio cannot exceed 200 characters"],
    default: ""
  },
  
  // Authentication
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"]
  },
  
  // User Role & Permissions
  role: {
    type: String,
    enum: ["user", "member", "volunteer", "team-lead"],
    default: "user"
  },
  
  // Activity & Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  isVerified: {
    type: Boolean,
    default: false
  },
  
  lastLogin: {
    type: Date,
    default: null
  },
  
  // Society Participation
  eventsAttended: [{
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    },
    attendedDate: Date
  }],
  
  skills: [{
    type: String,
    trim: true
  }],
  
  interests: [{
    type: String,
    trim: true
  }],
  
  // Social Links (optional)
  socialLinks: {
    linkedin: String,
    github: String,
    instagram: String,
    twitter: String
  },
  
  // Address Information
  address: {
    street: String,
    city: String,
    state: String,
    pincode: {
      type: String,
      match: [/^[0-9]{6}$/, "Please enter a valid pincode"]
    }
  },
  
  // Emergency Contact
  emergencyContact: {
    name: String,
    relation: String,
    phoneNumber: {
      type: String,
      match: [/^[0-9]{10}$/, "Please enter a valid phone number"]
    }
  },
  
  // Authentication & Security
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  emailVerificationToken: String,
  emailVerificationExpire: Date,
  
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ rollNumber: 1 });
userSchema.index({ phoneNumber: 1 });
userSchema.index({ department: 1, year: 1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const bcrypt = require('bcryptjs');
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  const bcrypt = require('bcryptjs');
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get full name with roll number
userSchema.methods.getDisplayName = function() {
  return `${this.name} (${this.rollNumber})`;
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
