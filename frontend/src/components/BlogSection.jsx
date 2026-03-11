import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Loading from "./Loading.jsx";

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestBlogs = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const response = await fetch(`${apiUrl}/api/blogs`);
        if (response.ok) {
          const data = await response.json();
          setBlogs(data.slice(0, 3));
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestBlogs();
  }, []);

  if (loading) return <div className="blog-section"><Loading /></div>;

  if (blogs.length === 0) return null;

  return (
    <section className="blog-section">
      <div className="container">
        <h2>Latest from Our Blog</h2>
        <p className="section-subtitle">
          Tips, insights, and resources for international students
        </p>

        <div className="blog-section-grid">
          {blogs.map((blog) => (
            <div key={blog._id} className="blog-section-card">
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
            </div>
          ))}
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
