import React, { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import Togglable from './components/Togglable';
import blogService from './services/blogs';
import loginService from './services/login';
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import './index.css';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
    );
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setErrorMessage('Successfully logged in!');
      setTimeout(() => setErrorMessage(null), 3000);
    } catch (exception) {
      setErrorMessage('Wrong username or password');
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser');
    setUser(null);
  };

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject);
      setBlogs(blogs.concat(returnedBlog).sort((a, b) => b.likes - a.likes));
      blogFormRef.current.toggleVisibility();
      setErrorMessage(`A new blog "${blogObject.title}" by ${blogObject.author} added!`);
      setTimeout(() => setErrorMessage(null), 3000);
    } catch (exception) {
      setErrorMessage('Error adding blog');
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  const updateBlog = async (id, updatedBlog) => {
    const returnedBlog = await blogService.update(id, updatedBlog);
    setBlogs(blogs.map(blog => (blog.id !== id ? blog : returnedBlog)).sort((a, b) => b.likes - a.likes));
  };

  const deleteBlog = async (id) => {
    const blogToDelete = blogs.find(blog => blog.id === id);
    const confirm = window.confirm(`Remove blog "${blogToDelete.title}" by ${blogToDelete.author}?`);
    if (confirm) {
      await blogService.remove(id);
      setBlogs(blogs.filter(blog => blog.id !== id));
      setErrorMessage(`Blog "${blogToDelete.title}" removed`);
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  return (
    <div>
      <h2>NOTES</h2>
      <Notification message={errorMessage} />
      {user === null ? (
        <Togglable buttonLabel="log in">
          <LoginForm handleLogin={handleLogin} />
        </Togglable>
      ) : (
        <div>
          <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
        </div>
      )}
      {blogs.map(blog => (
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          updateBlog={updateBlog}
          deleteBlog={deleteBlog}
        />
      ))}
    </div>
  );
};

export default App;
