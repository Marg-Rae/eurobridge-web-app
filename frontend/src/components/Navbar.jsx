import { useEffect, useRef, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import LanguageSwitcher from "./LanguageSwitcher.jsx";
import api from "../api/axios.js";

const Navbar = () => {
  const { t } = useLanguage();
  const [authToken, setAuthToken] = useState(() => localStorage.getItem("authToken") || "");
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

  const handleSignOut = async () => {
    try {
      await api.post("/api/auth/logout");
      setToken("");
    } catch (error) {
      console.error("Unable to sign out right now.", error);
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
        {authToken ? (
          <button type="button" className="portal-button" onClick={handleSignOut}>
            Sign Out
          </button>
        ) : (
          <>
            <Link to="/auth" className="portal-button">
              Staff Portal
            </Link>
            <Link to="/auth" className="portal-button ghost">
              Student Posrtal
            </Link>
          </>
        )}
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

    </header>
  );
};

export default Navbar;
