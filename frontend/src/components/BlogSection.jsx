import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Loading from "./Loading.jsx";
import { apiCall, API_ENDPOINTS } from "../api/config.js";

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentBlog, setCurrentBlog] = useState(0);

  useEffect(() => {
    const fetchLatestBlogs = async () => {
      try {
        // Use centralized API configuration
        const data = await apiCall(API_ENDPOINTS.BLOGS);
        setBlogs(data.slice(0, 3));
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestBlogs();
  }, []);

  // Auto-advance carousel every 6 seconds
  useEffect(() => {
    if (blogs.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentBlog((prev) => (prev + 1) % blogs.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [blogs.length]);

  const nextBlog = () => {
    setCurrentBlog((prev) => (prev + 1) % blogs.length);
  };

  const prevBlog = () => {
    setCurrentBlog((prev) => (prev - 1 + blogs.length) % blogs.length);
  };

  if (loading) return <div className="blog-section"><Loading /></div>;

  if (blogs.length === 0) return null;

  return (
    <section className="blog-section">
      <div className="container">
        <h2>Latest from Our Blog</h2>
        <p className="section-subtitle">
          Tips, insights, and resources for international students
        </p>

        <div className="blog-carousel">
          <button
            className="carousel-nav prev"
            onClick={prevBlog}
            aria-label="Previous blog"
          >
            ‹
          </button>

          <div className="blog-slides">
            {blogs.map((blog, index) => (
              <article
                key={blog._id}
                className={`blog-section-card ${index === currentBlog ? 'active' : ''}`}
                style={{
                  transform: `translateX(${(index - currentBlog) * 100}%)`,
                  opacity: index === currentBlog ? 1 : 0,
                  transition: 'all 0.5s ease-in-out'
                }}
              >
                {blog.image && (
                  <div className="blog-section-image">
                    <img src={blog.image} alt={blog.title} />
                  </div>
                )}
                <h3>{blog.title}</h3>
                <p>{blog.summary}</p>
                <Link to={`/blog/${blog.slug}`} className="link-arrow">
                  Read Full Article →
                </Link>
              </article>
            ))}
          </div>

          <button
            className="carousel-nav next"
            onClick={nextBlog}
            aria-label="Next blog"
          >
            ›
          </button>

          <div className="carousel-dots">
            {blogs.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentBlog ? 'active' : ''}`}
                onClick={() => setCurrentBlog(index)}
                aria-label={`Go to blog ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="blog-section-cta">
          <Link to="/blog" className="button primary">
            View All Articles
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
