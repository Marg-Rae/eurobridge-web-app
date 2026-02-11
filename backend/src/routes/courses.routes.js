import { Router } from "express";
import {
	createCourse,
	deleteCourse,
	getAllCourses,
	updateCourse
} from "../controllers/courses.controller.js";
import auth from "../middleware/auth.js";

const router = Router();

router.get("/", getAllCourses);
router.post("/", auth, createCourse);
router.put("/:id", auth, updateCourse);
router.delete("/:id", auth, deleteCourse);

export default router;
