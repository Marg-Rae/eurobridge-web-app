import Contact from "../models/Contact.js";

export const createContactSubmission = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email, and message are required" });
    }

    const submission = await Contact.create({ name, email, phone, message });
    res.status(201).json({ message: "Submission saved", submissionId: submission._id });
  } catch (error) {
    res.status(500).json({ message: "Failed to save submission" });
  }
};
