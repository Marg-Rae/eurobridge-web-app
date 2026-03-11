import { useEffect, useRef } from "react";
import { NavLink, Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import LanguageSwitcher from "./LanguageSwitcher.jsx";

const Navbar = () => {
  const isHidden = useRef(false);
  const lastScrollY = useRef(0);
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

  return (
    <header className="site-header">
      <div className="header-top">
        <LanguageSwitcher />
        <Link to="/school-portal" className="portal-button">
          School Portal
        </Link>
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
          <NavLink to="/blog">Blog</NavLink>
        </nav>
      </div>

    </header>
  );
};

export default Navbar;
