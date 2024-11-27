const Blog = require('../models/blog');

const getBlogs = async (req, res) => {
  const blogs = await Blog.find({});
  res.json(blogs);
};

const createBlog = async (req, res) => {
  const { title, url } = req.body;

  if (!title || !url) {
    return res.status(400).json({ error: 'Title and URL are required' });
  }

  const blog = new Blog(req.body);
  const savedBlog = await blog.save();
  res.status(201).json(savedBlog);
};

module.exports = { getBlogs, createBlog };