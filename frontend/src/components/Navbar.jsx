import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="site-header">
      <div className="brand-wrap">
        <img
          className="brand-logo"
          src="/assets/logo.jpg"
          alt="Eurobridge Language Institute"
        />
        <div>
          <div className="brand-name">Eurobridge</div>
          <div className="brand-tagline">Words that open doors</div>
        </div>
      </div>
      <nav className="nav-links">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/courses">Courses</NavLink>
        <NavLink to="/blog">Blog</NavLink>
        <NavLink to="/contact">Contact</NavLink>
        <NavLink to="/contact" className="nav-cta">
          Book a Consultation
        </NavLink>
      </nav>
    </header>
  );
};

export default Navbar;
