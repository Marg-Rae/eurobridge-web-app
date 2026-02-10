import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios.js";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

const BlogPost = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/api/blogs/${slug}`);
        setBlog(response.data);
      } catch (err) {
        setError("Unable to load the blog post right now.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (isLoading) {
    return <Loading label="Loading blog post" />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!blog) {
    return <ErrorMessage message="Blog post not found." />;
  }

  return (
    <section className="page">
      <p className="eyebrow">Blog</p>
      <h1>{blog.title}</h1>
      <p className="lead">{blog.excerpt}</p>
      <article className="article">{blog.content}</article>
    </section>
  );
};

export default BlogPost;
