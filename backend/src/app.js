import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import coursesRoutes from "./routes/courses.routes.js";
import blogsRoutes from "./routes/blogs.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();

// Set CORS_ORIGIN to your Netlify site URL in Render env vars.
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

app.use("/api/courses", coursesRoutes);
app.use("/api/blogs", blogsRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
