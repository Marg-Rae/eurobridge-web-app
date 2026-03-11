import Blog from "../models/Blog.js";

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
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
    console.error("Error fetching blog:", error);
    res.status(500).json({ message: "Failed to load blog post" });
  }
};

export const createBlog = async (req, res) => {
  try {
    const { title, slug, summary, content, image } = req.body;

    if (!title || !slug || !summary || !content) {
      return res.status(400).json({ message: "Missing required blog fields: title, slug, summary, content" });
    }

    // Check if slug already exists
    const existingBlog = await Blog.findOne({ slug: slug.toLowerCase() });
    if (existingBlog) {
      return res.status(400).json({ message: "Blog slug already exists" });
    }

    const blog = await Blog.create({ 
      title, 
      slug: slug.toLowerCase(), 
      summary, 
      content, 
      image,
      createdAt: new Date()
    });
    res.status(201).json(blog);
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ message: "Failed to create blog post" });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { title, slug, summary, content, image } = req.body;
    
    const updateData = {};
    if (title) updateData.title = title;
    if (slug) updateData.slug = slug.toLowerCase();
    if (summary) updateData.summary = summary;
    if (content) updateData.content = content;
    if (image) updateData.image = image;
    updateData.updatedAt = new Date();

    const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    res.json(blog);
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ message: "Failed to update blog post" });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    res.json({ message: "Blog post deleted", blog });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ message: "Failed to delete blog post" });
  }
};
