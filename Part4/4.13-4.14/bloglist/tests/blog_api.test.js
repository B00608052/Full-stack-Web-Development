const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Blog = require('../models/blog');
const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  const initialBlogs = [
    { title: 'Test Blog 1', author: 'Author 1', likes: 10 },
    { title: 'Test Blog 2', author: 'Author 2', likes: 20 }
  ];
  await Blog.insertMany(initialBlogs);
});

test('a blog can be deleted', async () => {
  const blogsAtStart = await Blog.find({});
  const blogToDelete = blogsAtStart[0];

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204); 

  const blogsAtEnd = await Blog.find({});
  expect(blogsAtEnd.length).toBe(blogsAtStart.length - 1);
  const titles = blogsAtEnd.map(blog => blog.title);
  expect(titles).not.toContain(blogToDelete.title); 
});

test('a blog can be updated', async () => {
  const blogsAtStart = await Blog.find({});
  const blogToUpdate = blogsAtStart[0];

  const updatedData = { likes: blogToUpdate.likes + 1 };

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedData)
    .expect(200); 

  expect(response.body.likes).toBe(updatedData.likes); 

  const blogsAtEnd = await Blog.find({});
  const updatedBlog = blogsAtEnd.find(blog => blog.id === blogToUpdate.id);
  expect(updatedBlog.likes).toBe(updatedData.likes); 
});

afterAll(() => {
  mongoose.connection.close();
});
