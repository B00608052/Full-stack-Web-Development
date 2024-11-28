const express = require('express');
const Blog = require('../models/blog');
const blogsRouter = express.Router();

blogsRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Blog.findByIdAndRemove(id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

blogsRouter.put('/:id', async (req, res) => {
  const { likes } = req.body;

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { likes },
      { new: true, runValidators: true }
    );
    if (updatedBlog) {
      res.status(200).json(updatedBlog);
    } else {
      res.status(404).json({ error: 'Blog not found' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

module.exports = blogsRouter;

