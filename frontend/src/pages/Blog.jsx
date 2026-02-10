import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/api/blogs");
        setBlogs(response.data);
      } catch (err) {
        setError("Unable to load blog posts right now.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (isLoading) {
    return <Loading label="Loading blog posts" />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <section className="page">
      <h1>Blog</h1>
      <div className="list">
        {blogs.map((blog) => (
          <Link key={blog._id} to={`/blog/${blog.slug}`} className="list-item">
            <h3>{blog.title}</h3>
            <p>{blog.excerpt}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Blog;
