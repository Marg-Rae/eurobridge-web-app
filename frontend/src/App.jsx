import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Academics from "./pages/Academics.jsx";
import Elearning from "./pages/Elearning.jsx";
import StudentPortal from "./pages/StudentPortal.jsx";

const App = () => {
  return (
    <div className="app-shell">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/academics" element={<Academics />} />
          <Route path="/elearning" element={<Elearning />} />
          <Route path="/portal" element={<StudentPortal />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
