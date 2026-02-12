import { useState } from "react";
import api from "../api/axios.js";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

const StudentPortal = () => {
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
      setAuthStatus({ loading: false, error: "", success: "Signed out." });
    } catch (error) {
      setAuthStatus({ loading: false, error: "Unable to sign out right now.", success: "" });
    }
  };

  return (
    <section className="page">
      <div className="section-header">
        <h1>Student Portal</h1>
        <p>Register, sign in, and manage your learning plan.</p>
      </div>
      <section className="panel-section portal-page">
        <div className="portal-card">
          <div className="auth-tabs">
            <button
              type="button"
              className={authMode === "signin" ? "tab active" : "tab"}
              onClick={() => setAuthMode("signin")}
            >
              Sign in
            </button>
            <button
              type="button"
              className={authMode === "register" ? "tab active" : "tab"}
              onClick={() => setAuthMode("register")}
            >
              Register
            </button>
          </div>
          <form className="auth-form" onSubmit={handleAuthSubmit}>
            {authMode === "register" && (
              <label>
                Full name
                <input
                  type="text"
                  name="name"
                  value={authForm.name}
                  onChange={handleAuthChange}
                  required
                />
              </label>
            )}
            <label>
              Email
              <input
                type="email"
                name="email"
                value={authForm.email}
                onChange={handleAuthChange}
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
                required
              />
            </label>
            <button className="button primary" type="submit" disabled={authStatus.loading}
            >
              {authMode === "register" ? "Create account" : "Sign in"}
            </button>
          </form>
          {authStatus.loading && <Loading label="Submitting" />}
          {authStatus.error && <ErrorMessage message={authStatus.error} />}
          {authStatus.success && <div className="status success">{authStatus.success}</div>}
          {authToken && (
            <div className="portal-footer">
              <span className="status success">Session active.</span>
              <button type="button" className="button ghost" onClick={handleSignOut}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
        <div className="portal-info">
          <h3>Need help getting started?</h3>
          <p>
            Create a student account to unlock application tracking, placement
            updates, and cohort scheduling. Our team will reach out within 48
            hours after you submit your details.
          </p>
          <ul>
            <li>Track your application status</li>
            <li>Get placement results and study plans</li>
            <li>Access course materials and schedules</li>
          </ul>
        </div>
      </section>
    </section>
  );
};

export default StudentPortal;
