import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

const Portal = () => {
  const navigate = useNavigate();
  const [authToken, setAuthToken] = useState(() => localStorage.getItem("authToken") || "");
  const [authMode, setAuthMode] = useState("signin");
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [authStatus, setAuthStatus] = useState({ loading: false, error: "", success: "" });

  const setToken = (token) => {
    setAuthToken(token);
    if (token) {
      localStorage.setItem("authToken", token);
    } else {
      localStorage.removeItem("authToken");
    }
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
        ? authForm
        : { email: authForm.email, password: authForm.password };
      const endpoint = authMode === "register" ? "/api/auth/register" : "/api/auth/login";
      const response = await api.post(endpoint, payload);
      setToken(response.data.token || "");

      const successMessage = authMode === "register"
        ? "Account created successfully! Welcome to Eurobridge."
        : "Signed in successfully.";

      setAuthStatus({ loading: false, error: "", success: successMessage });

      if (authMode === "register") {
        setAuthForm({ name: "", email: "", password: "" });
      }

      // Redirect after 1.5 seconds
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      const errorMessage = authMode === "register"
        ? error.response?.data?.message || "Unable to register. Please try again."
        : error.response?.data?.message || "Unable to sign in. Please check your credentials.";
      setAuthStatus({ loading: false, error: errorMessage, success: "" });
    }
  };

  const handleSignOut = async () => {
    setAuthStatus({ loading: true, error: "", success: "" });
    try {
      await api.post("/api/auth/logout");
      setToken("");
      setAuthStatus({ loading: false, error: "", success: "Signed out successfully." });
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      setAuthStatus({ loading: false, error: "Unable to sign out right now.", success: "" });
    }
  };

  if (authToken) {
    return (
      <section className="page">
        <div className="section-header">
          <h1>Welcome Back</h1>
          <p>You are signed in and ready to access your learning dashboard.</p>
        </div>
        <section className="panel-section portal-page">
          <div className="portal-card">
            <div className="portal-footer">
              <span className="status success">Session active. You&apos;re signed in.</span>
              <button type="button" className="button ghost" onClick={handleSignOut}>
                Sign Out
              </button>
            </div>
          </div>
        </section>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="section-header">
        <h1>Student & Staff Portal</h1>
        <p>Register for an account or sign in to access your learning dashboard.</p>
      </div>
      <section className="panel-section portal-page">
        <div className="portal-card">
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

          {authStatus.loading && <Loading label="Submitting" />}
          {authStatus.error && <ErrorMessage message={authStatus.error} />}
          {authStatus.success && (
            <div className="status success">{authStatus.success}</div>
          )}
        </div>
        <div className="portal-info">
          <h3>Why create an account?</h3>
          <p>
            Get access to your personalized learning dashboard, track progress, and
            stay updated with course schedules and notifications.
          </p>
          <ul>
            <li>Track your application and enrollment status</li>
            <li>Access course materials and live session recordings</li>
            <li>View your progress reports and assessments</li>
            <li>Manage your schedule and cohort assignments</li>
            <li>Communicate directly with mentors</li>
          </ul>
        </div>
      </section>
    </section>
  );
};

export default Portal;
