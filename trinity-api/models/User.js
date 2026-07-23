import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    registerNumber: {
      type: String,
      default: '',
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['Super Admin', 'Admin', 'Chief Warden', 'Warden', 'Security Staff', 'Mess Manager', 'Laundry Staff', 'Student'],
      default: 'Student',
      required: true,
    },
    department: {
      type: String,
      default: 'CSE',
    },
    hostelBlock: {
      type: String,
      default: 'A Block',
    },
    floor: {
      type: Number,
      default: 1,
    },
    roomNumber: {
      type: String,
      default: '101',
    },
    year: {
      type: Number,
      enum: [1, 2, 3, 4],
      default: 1,
    },
    phone: {
      type: String,
      default: '9876543210',
    },
    parentName: {
      type: String,
      default: '',
    },
    parentPhone: {
      type: String,
      default: '',
    },
    bloodGroup: {
      type: String,
      default: 'O+',
    },
    gender: {
      type: String,
      default: 'Male',
    },
    attendancePercent: {
      type: Number,
      default: 90,
    },
    feeStatus: {
      type: String,
      enum: ['Paid', 'Pending', 'Overdue'],
      default: 'Paid',
    },
    complaintCount: {
      type: Number,
      default: 0,
    },
    laundryUsage: {
      type: Number,
      default: 0,
    },
    messPlan: {
      type: String,
      default: 'Regular Non-Veg',
    },
    emergencyContact: {
      type: String,
      default: '',
    },
    accountLocked: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

export const User = mongoose.models.User || mongoose.model('User', userSchema)
