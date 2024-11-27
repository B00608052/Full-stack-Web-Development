const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');

const api = supertest(app);

const initialBlogs = [
  { title: "Blog1", author: "Author1", url: "http://example.com/1", likes: 5 },
  { title: "Blog2", author: "Author2", url: "http://example.com/2", likes: 10 },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);
});

describe('GET /api/blogs', () => {
  test('returns blogs as JSON and the correct amount of blogs', async () => {
    const response = await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body).toHaveLength(initialBlogs.length);
  });

  test('unique identifier property is named id', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body[0].id).toBeDefined();
  });
});

describe('POST /api/blogs', () => {
  test('successfully creates a new blog', async () => {
    const newBlog = {
      title: "New Blog",
      author: "New Author",
      url: "http://example.com/new",
      likes: 15,
    };

    await api.post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await Blog.find({});
    expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1);
  });

  test('defaults likes to 0 if missing', async () => {
    const newBlog = {
      title: "Blog without likes",
      author: "Author",
      url: "http://example.com/no-likes",
    };

    const response = await api.post('/api/blogs').send(newBlog);
    expect(response.body.likes).toBe(0);
  });

  test('responds with 400 if title or url is missing', async () => {
    const blogWithoutTitle = {
      author: "Author",
      url: "http://example.com/missing-title",
    };

    await api.post('/api/blogs').send(blogWithoutTitle).expect(400);

    const blogWithoutUrl = {
      title: "Missing URL",
      author: "Author",
    };

    await api.post('/api/blogs').send(blogWithoutUrl).expect(400);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
