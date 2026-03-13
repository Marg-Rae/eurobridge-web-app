import { Router } from "express";
import { login, logout, register, getCurrentUser } from "../controllers/auth.controller.js";
import auth from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", auth, getCurrentUser);

export default router;
