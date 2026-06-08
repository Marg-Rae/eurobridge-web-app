import { useEffect, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import LanguageSwitcher from "./LanguageSwitcher.jsx";

const Navbar = () => {
  const isHidden = useRef(false);
  const lastScrollY = useRef(0);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const isScrollingDown = currentY > lastScrollY.current;
      const shouldHide = isScrollingDown && currentY > 140;

      if (shouldHide !== isHidden.current) {
        isHidden.current = shouldHide;
        const header = document.querySelector(".site-header");
        if (header) {
          header.classList.toggle("is-hidden", shouldHide);
        }
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="site-header">
      <div className="header-top">
        <LanguageSwitcher />
        {user ? (
          <button className="portal-button" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <Link to="/school-portal" className="portal-button">
            School Portal
          </Link>
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
          <NavLink to="/" end>{t("nav.home")}</NavLink>
          <NavLink to="/academics">{t("nav.courses")}</NavLink>
          <NavLink to="/elearning">{t("nav.elearning")}</NavLink>
          <NavLink to="/about">{t("nav.about")}</NavLink>
          <NavLink to="/blog">{t("nav.blog")}</NavLink>
          {user && <NavLink to="/dashboard">Dashboard</NavLink>}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
