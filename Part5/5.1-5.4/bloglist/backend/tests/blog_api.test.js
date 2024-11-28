const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../index');
const Blog = require('../models/blog');
const User = require('../models/user');

const api = supertest(app);

let token = '';

const initialBlogs = [
  {
    title: 'Test Blog 1',
    author: 'John Doe',
    url: 'http://example.com/1',
    likes: 10,
  },
  {
    title: 'Test Blog 2',
    author: 'Jane Doe',
    url: 'http://example.com/2',
    likes: 5,
  },
];

beforeAll(async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});

  const user = {
    username: 'testuser',
    name: 'Test User',
    password: 'password',
  };

  await api.post('/api/users').send(user);

  const loginResponse = await api.post('/api/login').send({
    username: 'testuser',
    password: 'password',
  });

  token = loginResponse.body.token;
});

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);
});

describe('Blog API tests', () => {
  test('blogs are returned as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(initialBlogs.length);
  });

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs');
    const titles = response.body.map((blog) => blog.title);
    expect(titles).toContain('Test Blog 1');
  });

  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'New Test Blog',
      author: 'New Author',
      url: 'http://example.com/3',
      likes: 7,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');
    const titles = response.body.map((blog) => blog.title);

    expect(response.body).toHaveLength(initialBlogs.length + 1);
    expect(titles).toContain('New Test Blog');
  });

  test('adding a blog without token fails with 401', async () => {
    const newBlog = {
      title: 'Unauthorized Blog',
      author: 'Hacker',
      url: 'http://example.com/4',
      likes: 1,
    };

    await api.post('/api/blogs').send(newBlog).expect(401);

    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(initialBlogs.length);
  });

  test('a blog can be deleted', async () => {
    const blogsAtStart = await Blog.find({});
    const blogToDelete = blogsAtStart[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    const blogsAtEnd = await Blog.find({});
    expect(blogsAtEnd).toHaveLength(initialBlogs.length - 1);

    const titles = blogsAtEnd.map((blog) => blog.title);
    expect(titles).not.toContain(blogToDelete.title);
  });

  test('a blog without likes defaults to 0', async () => {
    const newBlog = {
      title: 'No Likes Blog',
      author: 'Author',
      url: 'http://example.com/5',
    };

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201);

    expect(response.body.likes).toBe(0);
  });

  test('a blog without title and url is not added', async () => {
    const newBlog = {
      author: 'Author',
      likes: 5,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400);

    const blogsAtEnd = await Blog.find({});
    expect(blogsAtEnd).toHaveLength(initialBlogs.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});