require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json());

const mongoUrl = 'mongodb+srv://b00608052:ntuhorti520@b00608052.iu8ks.mongodb.net/bloglist?retryWrites=true&w=majority&appName=b00608052';

mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

const Blog = mongoose.model('Blog', blogSchema);


app.get('/api/blogs', (req, res) => {
  Blog.find({})
    .then((blogs) => {
      res.json(blogs);
    })
    .catch((error) => {
      console.error('Error fetching blogs:', error.message);
      res.status(500).send({ error: 'Server error' });
    });
});

app.post('/api/blogs', (req, res) => {
  const blog = new Blog(req.body);

  blog
    .save()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((error) => {
      console.error('Error saving blog:', error.message);
      res.status(500).send({ error: 'Server error' });
    });
});

const PORT = 3004;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
