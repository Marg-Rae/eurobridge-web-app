import express from "express";
import {
  getStudentContent,
  updateStudentContent,
  getStaffContent,
  updateStaffContent,
  addActivityToStaff,
} from "../controllers/dashboard.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(auth);

// STUDENT DASHBOARD ROUTES
router.get("/student", getStudentContent);
router.post("/student", updateStudentContent);

// STAFF DASHBOARD ROUTES
router.get("/staff", getStaffContent);
router.post("/staff", updateStaffContent);
router.post("/staff/activity", addActivityToStaff);

export default router;
