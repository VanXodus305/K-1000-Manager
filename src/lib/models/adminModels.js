import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
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
  
  // Society Information
  joiningDate: {
    type: Date,
    required: [true, "Joining date is required"],
    default: Date.now
  },
  
  // Profile Image
  profileImage: {
    type: String,
    default: null // Store image URL or file path
  },
  
  // Additional Important Fields
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"]
  },
  
  role: {
    type: String,
    enum: ["admin"],
    default: "admin"
  },
  
  isActive: {
    type: Boolean,
    default: true
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
  
  // Authentication & Security
  lastLogin: {
    type: Date,
    default: null
  },
  
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Indexes for better query performance
adminSchema.index({ email: 1 });
adminSchema.index({ rollNumber: 1 });
adminSchema.index({ phoneNumber: 1 });

// Pre-save middleware to hash password
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const bcrypt = require('bcryptjs');
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to compare passwords
adminSchema.methods.comparePassword = async function(candidatePassword) {
  const bcrypt = require('bcryptjs');
  return await bcrypt.compare(candidatePassword, this.password);
};

const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

export default Admin;
