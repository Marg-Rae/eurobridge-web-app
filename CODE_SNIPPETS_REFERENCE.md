# Complete Code Snippets Reference

This document contains a summary of all the code components implemented in the MERN stack authentication and role-based dashboard system.

## Backend Components

### 1. User Model (backend/src/models/User.js)

```javascript
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "staff", "admin"], default: "student" }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
```

### 2. Auth Controller (backend/src/controllers/auth.controller.js)

```javascript
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const signToken = (user) =>
  jwt.sign(
    { email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { subject: user._id.toString(), expiresIn: "7d" }
  );

export const register = async (req, res) => {
  try {
    const { name, email, password, userType } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ 
      name, 
      email, 
      password: hashedPassword,
      role: userType || "student"
    });
    const token = signToken(user);

    return res.status(201).json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email, role: user.role } 
    });
  } catch (error) {
    console.error("Registration error:", error.message);
    return res.status(500).json({ message: "Failed to register user", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const matches = await bcrypt.compare(password, user.password);
    if (!matches) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken(user);
    return res.status(200).json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email, role: user.role } 
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ message: "Failed to login", error: error.message });
  }
};

export const logout = async (_req, res) => {
  return res.status(200).json({ message: "Signed out successfully" });
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Get current user error:", error.message);
    return res.status(500).json({ message: "Failed to fetch user", error: error.message });
  }
};
```

### 3. Auth Middleware (backend/src/middleware/auth.js)

```javascript
import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Missing or invalid authorization token" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub, email: payload.email, role: payload.role };
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default auth;

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied. Insufficient permissions." });
    }

    return next();
  };
};
```

### 4. Auth Routes (backend/src/routes/auth.routes.js)

```javascript
import { Router } from "express";
import { login, logout, register, getCurrentUser } from "../controllers/auth.controller.js";
import auth from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", auth, getCurrentUser);

export default router;
```

### 5. App Configuration (backend/src/app.js)

```javascript
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
```

---

## Frontend Components

### 1. Auth Context (frontend/src/contexts/AuthContext.jsx)

```javascript
import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios.js";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
      // Verify token is still valid by fetching current user
      fetchCurrentUser(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async (authToken) => {
    try {
      const response = await api.get("/api/auth/me", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setUser(response.data.user);
    } catch (error) {
      console.error("Failed to fetch current user:", error.message);
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, userType = "student") => {
    try {
      const response = await api.post("/api/auth/register", {
        name,
        email,
        password,
        userType,
      });
      const { token, user } = response.data;
      setToken(token);
      setUser(user);
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      return { success: false, message };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post("/api/auth/login", { email, password });
      const { token, user } = response.data;
      setToken(token);
      setUser(user);
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout error:", error.message);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

### 2. Login Page (frontend/src/pages/Login.jsx)

```javascript
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import "../styles/auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }

    const result = await login(email, password);

    if (result.success) {
      // Redirect based on role
      if (result.user.role === "staff") {
        navigate("/dashboard/staff");
      } else {
        navigate("/dashboard/student");
      }
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Sign In</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p className="auth-link">
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
```

### 3. Register Page (frontend/src/pages/Register.jsx)

```javascript
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import "../styles/auth.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    const result = await register(name, email, password, userType);

    if (result.success) {
      // Redirect based on role
      if (result.user.role === "staff") {
        navigate("/dashboard/staff");
      } else {
        navigate("/dashboard/student");
      }
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Create Account</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="userType">Account Type</label>
            <select
              id="userType"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              disabled={loading}
            >
              <option value="student">Student</option>
              <option value="staff">Staff</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>
        <p className="auth-link">
          Already have an account? <a href="/login">Sign in here</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
```

### 4. Protected Route (frontend/src/components/ProtectedRoute.jsx)

```javascript
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import Loading from "./Loading.jsx";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <Loading label="Loading..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
```

### 5. Student Dashboard (frontend/src/components/StudentDashboard.jsx)

```javascript
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <section className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user?.name}</h1>
          <p className="dashboard-subtitle">Student Dashboard</p>
        </div>
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </div>

      <div className="dashboard-container">
        <div className="dashboard-card">
          <h2>Profile Information</h2>
          <div className="profile-info">
            <p>
              <strong>Name:</strong> {user?.name}
            </p>
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <p>
              <strong>Role:</strong> <span className="role-badge">{user?.role}</span>
            </p>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Your Courses</h2>
          <div className="placeholder-content">
            <p>📚 You are enrolled in the following courses:</p>
            <ul>
              <li>Introduction to Programming</li>
              <li>Web Development Fundamentals</li>
              <li>Advanced JavaScript</li>
            </ul>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Progress</h2>
          <div className="placeholder-content">
            <p>📊 Your learning progress:</p>
            <div className="progress-item">
              <span>Introduction to Programming</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: "75%" }}></div>
              </div>
              <span>75%</span>
            </div>
            <div className="progress-item">
              <span>Web Development Fundamentals</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: "60%" }}></div>
              </div>
              <span>60%</span>
            </div>
            <div className="progress-item">
              <span>Advanced JavaScript</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: "45%" }}></div>
              </div>
              <span>45%</span>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Notifications</h2>
          <div className="placeholder-content">
            <p>🔔 Recent Updates:</p>
            <ul>
              <li>✓ Assignment deadline extension: Web Development Project (Next Monday)</li>
              <li>✓ New course material available in Advanced JavaScript</li>
              <li>✓ Your instructor posted feedback on your last quiz</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentDashboard;
```

### 6. Staff Dashboard (frontend/src/components/StaffDashboard.jsx)

```javascript
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

const StaffDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <section className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user?.name}</h1>
          <p className="dashboard-subtitle">Staff Dashboard</p>
        </div>
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </div>

      <div className="dashboard-container">
        <div className="dashboard-card">
          <h2>Profile Information</h2>
          <div className="profile-info">
            <p>
              <strong>Name:</strong> {user?.name}
            </p>
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <p>
              <strong>Role:</strong> <span className="role-badge staff">{user?.role}</span>
            </p>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Teaching Overview</h2>
          <div className="placeholder-content">
            <p>📊 Your Teaching Statistics:</p>
            <div className="stat-item">
              <span className="stat-label">Active Courses:</span>
              <span className="stat-value">5</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Students:</span>
              <span className="stat-value">145</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Average Class Size:</span>
              <span className="stat-value">29</span>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Courses</h2>
          <div className="placeholder-content">
            <p>📚 Courses You're Teaching:</p>
            <ul>
              <li>Web Development Fundamentals (Sec A)</li>
              <li>Web Development Fundamentals (Sec B)</li>
              <li>Advanced JavaScript Patterns</li>
              <li>Database Design Principles</li>
              <li>Full-Stack MERN Development</li>
            </ul>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Recent Activity</h2>
          <div className="placeholder-content">
            <p>🔔 Recent Updates:</p>
            <ul>
              <li>✓ New assignment submitted by 12 students in Sec A</li>
              <li>✓ 3 students requested 1-on-1 consultation</li>
              <li>✓ Course materials updated for Advanced JavaScript</li>
              <li>✓ Quiz results compiled for Web Development Fundamentals</li>
            </ul>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Quick Actions</h2>
          <div className="placeholder-content">
            <p>⚡ Manage your courses and students:</p>
            <div className="quick-actions">
              <button className="action-btn">📝 Grade Assignments</button>
              <button className="action-btn">👥 View Student List</button>
              <button className="action-btn">📅 Create Quiz</button>
              <button className="action-btn">📂 Upload Materials</button>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Student Performance</h2>
          <div className="placeholder-content">
            <p>📈 Q1 2025 Performance Summary:</p>
            <div className="performance-metrics">
              <div className="metric">
                <span>Average Grade:</span>
                <strong>B+ (87%)</strong>
              </div>
              <div className="metric">
                <span>Pass Rate:</span>
                <strong>94%</strong>
              </div>
              <div className="metric">
                <span>Students Needing Support:</span>
                <strong>8</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StaffDashboard;
```

### 7. App.jsx

```javascript
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { LanguageProvider } from "./contexts/LanguageContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Academics from "./pages/Academics.jsx";
import Elearning from "./pages/Elearning.jsx";
import Portal from "./pages/Portal.jsx";
import Blog from "./pages/Blog.jsx";
import BlogDetail from "./pages/BlogDetail.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import StudentDashboard from "./components/StudentDashboard.jsx";
import StaffDashboard from "./components/StaffDashboard.jsx";

const App = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <div className="app-shell">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/academics" element={<Academics />} />
            <Route path="/elearning" element={<Elearning />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/school-portal" element={<Portal />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard/student"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/staff"
              element={
                <ProtectedRoute allowedRoles={["staff", "admin"]}>
                  <StaffDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Footer />
        </div>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;
```

### 8. Axios Configuration (frontend/src/api/axios.js)

```javascript
import axios from "axios";

// Determine API base URL
let baseURL = "http://localhost:5000"; // Default for local development

// Use production URL for built app or non-localhost environments
if (window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
  baseURL = "https://eurobridge-web-app.onrender.com";
}

const api = axios.create({
  baseURL: baseURL
});

export default api;
```

---

## Environment Files

### Backend .env.example

```env
MONGODB_URI=mongodb+srv://your-username:password@cluster.mongodb.net/eurobridge
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### Frontend .env.example

```env
VITE_API_BASE_URL=http://localhost:5000
```

---

## Key Features Implemented

✅ **User Registration**
- Email validation
- Duplicate email checking
- Password hashing with bcrypt
- Role selection (student/staff)
- 201 status code on success

✅ **User Login**
- Email and password validation
- Password hash comparison
- JWT token generation
- 200 status code on success
- Role-based redirect

✅ **JWT Authentication**
- Token signing with user email and role
- 7-day expiration
- Token verification middleware
- Bearer token validation

✅ **Role-Based Access Control**
- Student role redirects to `/dashboard/student`
- Staff role redirects to `/dashboard/staff`
- Protected routes prevent unauthorized access
- Role authorization in middleware

✅ **Frontend State Management**
- AuthContext for global authentication state
- Automatic token persistence with localStorage
- Token recovery on page refresh
- Automatic logout on invalid token

✅ **API Handling**
- Multiple HTTP status codes (200, 201, 400, 401, 403, 404, 500)
- Proper error messages
- CORS configuration
- Token header injection

✅ **Dashboard Components**
- User profile information display
- Logout functionality
- Role-specific content
- Responsive design
- Placeholder content for courses and activities

---

## Integration Checklist

- [ ] Backend environment variables configured
- [ ] MongoDB URI set correctly
- [ ] JWT_SECRET set to secure value
- [ ] Frontend environment variables configured
- [ ] VITE_API_BASE_URL points to correct backend
- [ ] npm install completed for both frontend and backend
- [ ] Backend server starts without errors
- [ ] Frontend development server starts without errors
- [ ] Can register new user
- [ ] Can login with registered credentials
- [ ] Dashboard loads after login
- [ ] Role-based redirects work correctly
- [ ] Protected routes prevent unauthorized access
- [ ] Logout clears token and redirects to home
- [ ] Token persists on page refresh
- [ ] CORS errors resolved

