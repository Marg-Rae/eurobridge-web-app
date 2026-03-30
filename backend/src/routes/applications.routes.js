import { Router } from "express";
import {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplicationStatus
} from "../controllers/applications.controller.js";

const router = Router();

// Public routes
router.post("/", createApplication);

// Admin routes (can add middleware authentication later)
router.get("/", getApplications);
router.get("/:id", getApplicationById);
router.patch("/:id/status", updateApplicationStatus);

export default router;
