import Blog from "../models/Blog.js";

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ publishedAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Failed to load blog posts" });
  }
};

export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });

    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: "Failed to load blog post" });
  }
};
