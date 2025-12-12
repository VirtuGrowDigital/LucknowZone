import Blog from "../models/Blog.js";

export const createBlog = async (req, res) => {
  try {
    const blog = await Blog.create({
      title: req.body.title,
      slug: req.body.slug,
      content: req.body.content,
      image: req.body.image,
      tags: req.body.tags,
      createdAt: new Date(),
    });

    res.json({ success: true, blog });
  } catch (err) {
    console.error("Create Blog Error:", err);
    res.status(500).json({ error: "Blog creation failed" });
  }
};

export const getBlogs = async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.json({ success: true, blogs });
};
