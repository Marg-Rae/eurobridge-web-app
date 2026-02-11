import { Router } from "express";
import {
	createBlog,
	deleteBlog,
	getAllBlogs,
	getBlogBySlug,
	updateBlog
} from "../controllers/blogs.controller.js";
import auth from "../middleware/auth.js";

const router = Router();

router.get("/", getAllBlogs);
router.get("/:slug", getBlogBySlug);
router.post("/", auth, createBlog);
router.put("/:id", auth, updateBlog);
router.delete("/:id", auth, deleteBlog);

export default router;
