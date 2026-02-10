import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="site-header">
      <div className="brand">Eurobridge</div>
      <nav>
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/courses">Courses</NavLink>
        <NavLink to="/blog">Blog</NavLink>
        <NavLink to="/contact">Contact</NavLink>
      </nav>
    </header>
  );
};

export default Navbar;
