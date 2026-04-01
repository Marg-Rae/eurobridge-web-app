import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    dateOfBirth: { type: Date },
    parentName: { type: String },
    parentEmail: { type: String },
    parentPhone: { type: String },
    currentLevel: { type: String, default: "beginner" },
    preferredCourse: { type: String, required: true },
    motivation: { type: String },
    experience: { type: String },
    availability: { type: String },
    agreeToTerms: { type: Boolean, default: false },
    status: { type: String, enum: ["pending", "reviewed", "approved", "rejected"], default: "pending" },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const Application = mongoose.model("Application", applicationSchema);

export default Application;
