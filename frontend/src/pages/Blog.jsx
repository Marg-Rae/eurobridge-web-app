import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        
        // Determine API base URL
        let apiUrl = "http://localhost:5000"; // Default for local development
        
        // Use production URL for non-localhost environments
        if (window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
          apiUrl = "https://eurobridge-web-app.onrender.com";
        }
        
        const response = await fetch(`${apiUrl}/api/blogs`);
        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }
        const data = await response.json();
        setBlogs(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Unable to load blog posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="blog-page">
      <div className="blog-hero">
        <h1>Our Blog</h1>
        <p>Insights, tips, and resources for international students</p>
      </div>

      <div className="container">
        {error && <ErrorMessage message={error} />}
        
        {blogs.length === 0 ? (
          <div className="no-content">
            <p>No blog posts available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="blog-grid">
            {blogs.map((blog) => (
              <article key={blog._id} className="blog-card">
                {blog.image && (
                  <div className="blog-card-image">
                    <img src={blog.image} alt={blog.title} />
                  </div>
                )}
                <div className="blog-card-content">
                  <h2>{blog.title}</h2>
                  <p className="blog-summary">{blog.summary}</p>
                  <div className="blog-meta">
                    <span className="blog-date">
                      {new Date(blog.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </span>
                  </div>
                  <Link to={`/blog/${blog.slug}`} className="button primary">
                    Read More
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
