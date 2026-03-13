import StudentContent from "../models/StudentContent.js";
import StaffContent from "../models/StaffContent.js";

// STUDENT CONTENT CONTROLLERS

export const getStudentContent = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Fetching student content for userId:", userId);

    let content = await StudentContent.findOne({ userId });

    // If no content exists, create a blank one
    if (!content) {
      console.log("No existing content, creating blank");
      content = await StudentContent.create({
        userId,
        courses: [],
        grades: [],
        assignments: [],
      });
    }

    res.status(200).json({ content });
  } catch (error) {
    console.error("Error fetching student content:", error.message);
    res.status(500).json({ message: "Failed to fetch student content", error: error.message });
  }
};

export const updateStudentContent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courses, grades, assignments } = req.body;

    console.log("Updating student content for userId:", userId);

    let content = await StudentContent.findOne({ userId });

    if (!content) {
      content = await StudentContent.create({
        userId,
        courses: courses || [],
        grades: grades || [],
        assignments: assignments || [],
      });
    } else {
      content.courses = courses || content.courses;
      content.grades = grades || content.grades;
      content.assignments = assignments || content.assignments;
      await content.save();
    }

    console.log("Student content updated successfully");
    res.status(200).json({ content, message: "Student content updated" });
  } catch (error) {
    console.error("Error updating student content:", error.message);
    res.status(500).json({ message: "Failed to update student content", error: error.message });
  }
};

// STAFF CONTENT CONTROLLERS

export const getStaffContent = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Fetching staff content for userId:", userId);

    let content = await StaffContent.findOne({ userId });

    // If no content exists, create a blank one
    if (!content) {
      console.log("No existing content, creating blank");
      content = await StaffContent.create({
        userId,
        courses: [],
        statistics: {
          activeCourses: 0,
          totalStudents: 0,
          averageClassSize: 0,
        },
        recentActivity: [],
      });
    }

    res.status(200).json({ content });
  } catch (error) {
    console.error("Error fetching staff content:", error.message);
    res.status(500).json({ message: "Failed to fetch staff content", error: error.message });
  }
};

export const updateStaffContent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courses, statistics, recentActivity } = req.body;

    console.log("Updating staff content for userId:", userId);

    let content = await StaffContent.findOne({ userId });

    if (!content) {
      content = await StaffContent.create({
        userId,
        courses: courses || [],
        statistics: statistics || {
          activeCourses: 0,
          totalStudents: 0,
          averageClassSize: 0,
        },
        recentActivity: recentActivity || [],
      });
    } else {
      content.courses = courses || content.courses;
      content.statistics = statistics || content.statistics;
      content.recentActivity = recentActivity || content.recentActivity;
      await content.save();
    }

    console.log("Staff content updated successfully");
    res.status(200).json({ content, message: "Staff content updated" });
  } catch (error) {
    console.error("Error updating staff content:", error.message);
    res.status(500).json({ message: "Failed to update staff content", error: error.message });
  }
};

export const addActivityToStaff = async (req, res) => {
  try {
    const userId = req.user.id;
    const { activity } = req.body;

    if (!activity) {
      return res.status(400).json({ message: "Activity text is required" });
    }

    let content = await StaffContent.findOne({ userId });

    if (!content) {
      content = await StaffContent.create({
        userId,
        recentActivity: [activity],
      });
    } else {
      content.recentActivity.unshift(activity); // Add to beginning
      if (content.recentActivity.length > 10) {
        content.recentActivity = content.recentActivity.slice(0, 10); // Keep only 10
      }
      await content.save();
    }

    res.status(200).json({ content });
  } catch (error) {
    console.error("Error adding activity:", error.message);
    res.status(500).json({ message: "Failed to add activity", error: error.message });
  }
};
