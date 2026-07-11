import { Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Academics from "./pages/Academics.jsx";
import Elearning from "./pages/Elearning.jsx";
import ApplicationForm from "./pages/ApplicationForm.jsx";
import Blog from "./pages/Blog.jsx";
import BlogDetail from "./pages/BlogDetail.jsx";

const App = () => {
  return (
    <LanguageProvider>
      <div className="app-shell">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/academics" element={<Academics />} />
          <Route path="/elearning" element={<Elearning />} />
          <Route path="/apply" element={<ApplicationForm />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
        </Routes>
        <Footer />
      </div>
    </LanguageProvider>
  );
};

export default App;
