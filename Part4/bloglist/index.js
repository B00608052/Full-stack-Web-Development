require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

const mongoUrl = process.env.MONGODB_URI;
mongoose.connect(mongoUrl)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err.message));

app.use(cors());
app.use(express.json());

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
});

const Blog = mongoose.model('Blog', blogSchema);

app.get('/api/blogs', (req, res) => {
  Blog.find({}).then(blogs => res.json(blogs));
});

app.post('/api/blogs', (req, res) => {
  const blog = new Blog(req.body);
  blog.save().then(result => res.status(201).json(result));
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

