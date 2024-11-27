const express = require('express');
const { getBlogs, createBlog } = require('../controllers/blogs');

const router = express.Router();

router.get('/', getBlogs);
router.post('/', createBlog);

module.exports = router;
