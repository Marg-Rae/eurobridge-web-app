import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.status(200).json({ users });
  } catch (error) {
    console.error("Get users error:", error.message);
    res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
};

// Create a new user (admin only)
export const createUser = async (req, res) => {
  try {
    const { name, email, password, userType, role } = req.body;

    // Use userType or role parameter (userType is from Portal, role is from admin form)
    const userRole = userType || role || "student";

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: userRole,
    });

    // Return user without password
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    res.status(201).json({ message: "User created successfully", user: userResponse });
  } catch (error) {
    console.error("Create user error:", error.message);
    res.status(500).json({ message: "Failed to create user", error: error.message });
  }
};

// Update user role (admin only)
export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!role || !["student", "staff", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User role updated", user });
  } catch (error) {
    console.error("Update user role error:", error.message);
    res.status(500).json({ message: "Failed to update user", error: error.message });
  }
};

// Delete user (admin only)
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error.message);
    res.status(500).json({ message: "Failed to delete user", error: error.message });
  }
};

// Get user statistics (admin only)
export const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const students = await User.countDocuments({ role: "student" });
    const staff = await User.countDocuments({ role: "staff" });
    const admins = await User.countDocuments({ role: "admin" });

    res.status(200).json({
      stats: {
        totalUsers,
        students,
        staff,
        admins,
      },
    });
  } catch (error) {
    console.error("Get user stats error:", error.message);
    res.status(500).json({ message: "Failed to fetch statistics", error: error.message });
  }
};
