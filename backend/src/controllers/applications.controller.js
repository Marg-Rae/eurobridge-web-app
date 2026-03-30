import Application from "../models/Application.js";

export const createApplication = async (req, res) => {
  try {
    const { fullName, email, phone, dateOfBirth, currentLevel, preferredCourse, motivation, experience, availability, agreeToTerms } = req.body;

    // Validate required fields
    if (!fullName || !email || !preferredCourse) {
      return res.status(400).json({ message: "Full name, email, and preferred course are required" });
    }

    if (!agreeToTerms) {
      return res.status(400).json({ message: "You must agree to the terms and conditions" });
    }

    // Check if application already exists for this email
    const existingApplication = await Application.findOne({ email });
    if (existingApplication) {
      return res.status(409).json({ message: "An application from this email already exists" });
    }

    // Create new application
    const application = await Application.create({
      fullName,
      email,
      phone,
      dateOfBirth,
      currentLevel,
      preferredCourse,
      motivation,
      experience,
      availability,
      agreeToTerms,
      status: "pending"
    });

    res.status(201).json({
      message: "Application submitted successfully",
      applicationId: application._id
    });
  } catch (error) {
    console.error("Application submission error:", error);
    res.status(500).json({ message: "Failed to submit application" });
  }
};

export const getApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({
      count: applications.length,
      applications
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};

export const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json(application);
  } catch (error) {
    console.error("Error fetching application:", error);
    res.status(500).json({ message: "Failed to fetch application" });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !["pending", "reviewed", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({
      message: "Application status updated",
      application
    });
  } catch (error) {
    console.error("Error updating application:", error);
    res.status(500).json({ message: "Failed to update application" });
  }
};
