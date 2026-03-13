import mongoose from "mongoose";

const studentContentSchema = new mongoose.Schema(
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
        code: String,
        credits: Number,
        completed: Boolean,
      },
    ],
    grades: [
      {
        courseId: String,
        courseName: String,
        grade: String,
        percentage: Number,
      },
    ],
    assignments: [
      {
        title: String,
        course: String,
        dueDate: Date,
        submitted: Boolean,
        grade: String,
      },
    ],
  },
  { timestamps: true }
);

const StudentContent = mongoose.model("StudentContent", studentContentSchema);

export default StudentContent;
