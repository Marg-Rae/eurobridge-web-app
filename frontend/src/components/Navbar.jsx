import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import LanguageSwitcher from "./LanguageSwitcher.jsx";
import api from "../api/axios.js";
import Loading from "./Loading.jsx";
import ErrorMessage from "./ErrorMessage.jsx";

const Navbar = () => {
  const { t } = useLanguage();
  const [authToken, setAuthToken] = useState(() => localStorage.getItem("authToken") || "");
  const [authMode, setAuthMode] = useState("signin");
  const [authOpen, setAuthOpen] = useState(false);
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [authStatus, setAuthStatus] = useState({ loading: false, error: "", success: "" });
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);

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

  const openPortal = (mode) => {
    setAuthMode(mode);
    setAuthStatus({ loading: false, error: "", success: "" });
    setAuthOpen(true);
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
        ? t("auth.successRegister")
        : t("auth.successSignIn");

      setAuthStatus({ loading: false, error: "", success: successMessage });

      if (authMode === "register") {
        setAuthForm({ name: "", email: "", password: "" });
      }
    } catch (error) {
      const errorMessage = authMode === "register"
        ? error.response?.data?.message || "Registration failed. Please try again."
        : error.response?.data?.message || "Sign in failed. Please check your credentials.";
      setAuthStatus({ loading: false, error: errorMessage, success: "" });
    }
  };

  const handleSignOut = async () => {
    setAuthStatus({ loading: true, error: "", success: "" });
    try {
      await api.post("/api/auth/logout");
      setToken("");
      setAuthStatus({ loading: false, error: "", success: t("auth.successSignOut") });
    } catch (error) {
      setAuthStatus({ loading: false, error: "Unable to sign out right now.", success: "" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const isScrollingDown = currentY > lastScrollY.current;
      const shouldHide = isScrollingDown && currentY > 140;

      setIsHidden(shouldHide);
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={isHidden ? "site-header is-hidden" : "site-header"}>
      <div className="header-top">
        <LanguageSwitcher />
        <button type="button" className="portal-button" onClick={() => openPortal("signin")}
        >
          {t("nav.staffPortal")}
        </button>
        <NavLink to="/portal" className="portal-button ghost">
          {t("nav.studentPortal")}
        </NavLink>
      </div>
      <div className="header-bottom">
        <div className="brand-wrap">
          <img
            className="brand-logo"
            src="/assets/logo.jpg"
            alt="Eurobridge Language Institute"
          />
          <div>
            <div className="brand-name">Eurobridge Language Institute</div>
            <div className="brand-tagline">Words that open doors</div>
          </div>
        </div>
        <nav className="nav-links">
          <NavLink to="/" end>
            {t("nav.home")}
          </NavLink>
          <NavLink to="/about">{t("nav.about")}</NavLink>
          <NavLink to="/academics">{t("nav.academics")}</NavLink>
          <NavLink to="/elearning">{t("nav.elearning")}</NavLink>
        </nav>
      </div>
      <div className={authOpen ? "auth-modal open" : "auth-modal"}>
        <div className="auth-modal-panel">
          <button
            type="button"
            className="auth-close"
            onClick={() => setAuthOpen(false)}
            aria-label="Close portal"
          >
            {t("auth.close")}
          </button>
          <div className="auth-tabs">
            <button
              type="button"
              className={authMode === "signin" ? "tab active" : "tab"}
              onClick={() => setAuthMode("signin")}
            >
              {t("auth.signIn")}
            </button>
            <button
              type="button"
              className={authMode === "register" ? "tab active" : "tab"}
              onClick={() => setAuthMode("register")}
            >
              {t("auth.register")}
            </button>
          </div>
          <form className="auth-form" onSubmit={handleAuthSubmit}>
            {authMode === "register" && (
              <label>
                {t("auth.fullName")}
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
              {t("auth.email")}
              <input
                type="email"
                name="email"
                value={authForm.email}
                onChange={handleAuthChange}
                required
              />
            </label>
            <label>
              {t("auth.password")}
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
              {authMode === "register" ? t("auth.createAccount") : t("auth.signIn")}
            </button>
          </form>
          {authStatus.loading && <Loading label="Submitting" />}
          {authStatus.error && <ErrorMessage message={authStatus.error} />}
          {authStatus.success && <div className="status success">{authStatus.success}</div>}
          {authToken && (
            <div className="portal-footer">
              <span className="status success">{t("auth.sessionActive")}</span>
              <button type="button" className="button ghost" onClick={handleSignOut}
              >
                {t("auth.signOut")}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
