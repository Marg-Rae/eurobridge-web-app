import mongoose from "mongoose";

const staffContentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    courses: [
      {
        name: String,
        section: String,
        students: Number,
      },
    ],
    statistics: {
      activeCourses: Number,
      totalStudents: Number,
      averageClassSize: Number,
    },
    recentActivity: [
      {
        type: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const StaffContent = mongoose.model("StaffContent", staffContentSchema);

export default StaffContent;
