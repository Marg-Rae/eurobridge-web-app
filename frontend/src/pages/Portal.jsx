import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

const Portal = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("role-select"); // "role-select", "auth"
  const [userType, setUserType] = useState(""); // "student" or "staff"
  const [authMode, setAuthMode] = useState("signin"); // "signin" or "register"
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [authStatus, setAuthStatus] = useState({ loading: false, error: "", success: "" });

  const handleRoleSelect = (role) => {
    setUserType(role);
    setStep("auth");
    setAuthStatus({ loading: false, error: "", success: "" });
  };

  const handleAuthChange = (event) => {
    const { name, value } = event.target;
    setAuthForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    setAuthStatus({ loading: true, error: "", success: "" });

    try {
      const payload = authMode === "register"
        ? { ...authForm, userType }
        : { email: authForm.email, password: authForm.password };
      
      const endpoint = authMode === "register" ? "/api/auth/register" : "/api/auth/login";
      const response = await api.post(endpoint, payload);
      
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
      }

      const successMessage = authMode === "register"
        ? "Account created successfully! Redirecting to your dashboard..."
        : "Signed in successfully. Redirecting to your dashboard...";

      setAuthStatus({ loading: false, error: "", success: successMessage });

      // Redirect after 1.5 seconds to unified dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      const errorMessage = authMode === "register"
        ? error.response?.data?.message || "Unable to register. Please try again."
        : error.response?.data?.message || "Unable to sign in. Please check your credentials.";
      setAuthStatus({ loading: false, error: errorMessage, success: "" });
    }
  };

  const handleBackToRoleSelect = () => {
    setStep("role-select");
    setAuthForm({ name: "", email: "", password: "" });
    setAuthStatus({ loading: false, error: "", success: "" });
  };

  if (step === "role-select") {
    return (
      <section className="page">
        <div className="section-header" style={{ textAlign: "center" }}>
          <h1>Welcome to Eurobridge</h1>
          <p>Choose your role to get started</p>
        </div>
        <section className="panel-section">
          <div className="role-select-container">
            <div className="role-card" onClick={() => handleRoleSelect("student")}>
              <div className="role-icon">👨‍🎓</div>
              <h3>Student</h3>
              <p>Access your courses, track progress, and manage your learning journey</p>
              <button type="button" className="button primary">Continue as Student</button>
            </div>
            <div className="role-card" onClick={() => handleRoleSelect("staff")}>
              <div className="role-icon">👨‍🏫</div>
              <h3>Staff/Instructor</h3>
              <p>Manage courses, track student progress, and access analytics</p>
              <button type="button" className="button primary">Continue as Staff</button>
            </div>
          </div>
        </section>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="section-header" style={{ textAlign: "center" }}>
        <h1>{userType === "staff" ? "Staff" : "Student"} Portal</h1>
        <p>Sign in or create an account to access your dashboard</p>
      </div>
      <section className="panel-section portal-page">
        <div className="portal-card">
          <button 
            type="button" 
            className="button secondary" 
            onClick={handleBackToRoleSelect}
            style={{ marginBottom: "1.5rem" }}
          >
            ← Change Role
          </button>
          
          <div className="auth-tabs">
            <button
              type="button"
              className={authMode === "signin" ? "tab active" : "tab"}
              onClick={() => {
                setAuthMode("signin");
                setAuthStatus({ loading: false, error: "", success: "" });
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={authMode === "register" ? "tab active" : "tab"}
              onClick={() => {
                setAuthMode("register");
                setAuthStatus({ loading: false, error: "", success: "" });
              }}
            >
              Register
            </button>
          </div>

          <form className="auth-form" onSubmit={handleAuthSubmit}>
            {authMode === "register" && (
              <label>
                Full Name
                <input
                  type="text"
                  name="name"
                  value={authForm.name}
                  onChange={handleAuthChange}
                  placeholder="Your full name"
                  required
                />
              </label>
            )}
            <label>
              Email Address
              <input
                type="email"
                name="email"
                value={authForm.email}
                onChange={handleAuthChange}
                placeholder="you@example.com"
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                name="password"
                value={authForm.password}
                onChange={handleAuthChange}
                placeholder="Enter your password"
                required
              />
            </label>
            <button className="button primary" type="submit" disabled={authStatus.loading}>
              {authMode === "register" ? "Create Account" : "Sign In"}
            </button>
          </form>

          {authStatus.loading && <Loading label="Processing" />}
          {authStatus.error && <ErrorMessage message={authStatus.error} />}
          {authStatus.success && (
            <div className="status success">{authStatus.success}</div>
          )}
        </div>

        <div className="portal-info">
          <h3>
            {userType === "staff" ? "Staff Account Benefits" : "Student Account Benefits"}
          </h3>
          {userType === "staff" ? (
            <ul>
              <li>Manage your courses and curriculum</li>
              <li>Track student progress and performance</li>
              <li>Access detailed analytics and reports</li>
              <li>Create and assign assessments</li>
              <li>Communicate with students and colleagues</li>
            </ul>
          ) : (
            <ul>
              <li>Track your application and enrollment status</li>
              <li>Access course materials and live session recordings</li>
              <li>View your progress reports and assessments</li>
              <li>Manage your schedule and cohort assignments</li>
              <li>Communicate directly with mentors</li>
            </ul>
          )}
        </div>
      </section>
    </section>
  );
};

export default Portal;
