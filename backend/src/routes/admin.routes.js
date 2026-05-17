import { Router } from "express";
import auth, { authorizeRoles } from "../middleware/auth.js";
import {
  getAllUsers,
  createUser,
  updateUserRole,
  deleteUser,
  getUserStats,
} from "../controllers/admin.controller.js";

const router = Router();

// All admin routes require authentication and admin role
router.use(auth);
router.use(authorizeRoles("admin"));

// Get all users
router.get("/users", getAllUsers);

// Create a new user
router.post("/users", createUser);

// Update user role
router.patch("/users/:userId", updateUserRole);

// Delete user
router.delete("/users/:userId", deleteUser);

// Get user statistics
router.get("/stats", getUserStats);

export default router;
