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

export const createBlog = async (req, res) => {
  try {
    const { title, slug, excerpt, content, publishedAt } = req.body;

    if (!title || !slug || !excerpt || !content) {
      return res.status(400).json({ message: "Missing required blog fields" });
    }

    const blog = await Blog.create({ title, slug, excerpt, content, publishedAt });
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Failed to create blog post" });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: "Failed to update blog post" });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    res.json({ message: "Blog post deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete blog post" });
  }
};
