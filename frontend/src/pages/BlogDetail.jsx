import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        
        // Determine API base URL
        let apiUrl = "http://localhost:5000"; // Default for local development
        
        // Use production URL for non-localhost environments
        if (window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
          apiUrl = "https://eurobridge-web-app-2.onrender.com";
        }
        
        const response = await fetch(`${apiUrl}/api/blogs/${slug}`);
        if (!response.ok) {
          throw new Error("Blog post not found");
        }
        const data = await response.json();
        setBlog(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("Unable to load blog post. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) return <Loading />;

  if (error) return <ErrorMessage message={error} />;

  if (!blog) {
    return (
      <div className="container blog-detail-error">
        <h1>Blog Post Not Found</h1>
        <p>The blog post you're looking for doesn't exist.</p>
        <Link to="/blog" className="button primary">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <article className="blog-detail">
      {blog.image && (
        <div className="blog-detail-image">
          <img src={blog.image} alt={blog.title} />
        </div>
      )}

      <div className="container blog-detail-content">
        <header className="blog-detail-header">
          <h1>{blog.title}</h1>
          <div className="blog-detail-meta">
            <span className="blog-date">
              Published on{" "}
              {new Date(blog.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </span>
            {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
              <span className="blog-updated">
                Updated on{" "}
                {new Date(blog.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </span>
            )}
          </div>
        </header>

        <div
          className="blog-body"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        <div className="blog-cta">
          <h3>Ready to Start Your Ausbildung Journey?</h3>
          <p>
            Connect with our experts to learn more about programs in Germany.
          </p>
          <Link to="/school-portal?type=student" className="button primary">
            Get in Touch
          </Link>
        </div>

        <footer className="blog-detail-footer">
          <Link to="/blog" className="button ghost">
            ← Back to All Articles
          </Link>
        </footer>
      </div>
    </article>
  );
};

export default BlogDetail;
