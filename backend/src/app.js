import express from "express";
import cors from "cors";
import config from "./config.js";
import coursesRoutes from "./routes/courses.routes.js";
import blogsRoutes from "./routes/blogs.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import applicationsRoutes from "./routes/applications.routes.js";

const app = express();

// CORS Configuration - use centralized config
// Allow localhost on any port plus configured production origins
const allowedOrigins = [
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/,
  /\.netlify\.app$/,
  "https://eurobridgelanguageinstitute.com",
  "https://eurobridge-web-app.onrender.com",
  "https://eurobridge-web-app-2.onrender.com",
  config.CORS_ORIGIN
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.some((allowed) => {
      if (typeof allowed === 'string') return allowed === origin;
      if (allowed instanceof RegExp) return allowed.test(origin);
      return false;
    });

    if (isAllowed || process.env.NODE_ENV === 'development') {
      // Return the requesting origin so browser receives Access-Control-Allow-Origin
      return callback(null, origin);
    }

    console.log(`CORS blocked origin: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Security headers for production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });
}

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Simple test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint working' });
});

app.use("/api/courses", coursesRoutes);
app.use("/api/blogs", blogsRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/applications", applicationsRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
