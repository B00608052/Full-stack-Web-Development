const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const middleware = require('../utils/middleware');

blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
    res.json(blogs);
});

blogsRouter.post('/', middleware.userExtractor, async (req, res, next) => {
    const { title, author, url, likes } = req.body;

    if (!req.user) {
        return res.status(401).json({ error: 'token missing or invalid' });
    }

    const blog = new Blog({
        title,
        author,
        url,
        likes: likes || 0,
        user: req.user.id,
    });

    const savedBlog = await blog.save();
    req.user.blogs = req.user.blogs.concat(savedBlog._id);
    await req.user.save();

    res.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', middleware.userExtractor, async (req, res, next) => {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
        return res.status(404).end();
    }

    if (blog.user.toString() !== req.user.id) {
        return res.status(403).json({ error: 'only the creator can delete a blog' });
    }

    await Blog.findByIdAndRemove(req.params.id);
    res.status(204).end();
});

module.exports = blogsRouter;

