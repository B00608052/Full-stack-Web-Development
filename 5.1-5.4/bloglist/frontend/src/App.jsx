import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newUrl, setNewUrl] = useState('');

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });

      setUser(user);
      setUsername('');
      setPassword('');
      setMessage('Login successful');
      setTimeout(() => setMessage(null), 5000);

      blogService.setToken(user.token);
    } catch (error) {
      setErrorMessage('Invalid username or password');
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  const addBlog = async (event) => {
    event.preventDefault();
    try {
      const newBlog = {
        title: newTitle,
        author: newAuthor,
        url: newUrl,
      };

      const savedBlog = await blogService.create(newBlog);
      setBlogs(blogs.concat(savedBlog));
      setNewTitle('');
      setNewAuthor('');
      setNewUrl('');
      setMessage(`A new blog "${savedBlog.title}" by ${savedBlog.author} added`);
      setTimeout(() => setMessage(null), 5000);
    } catch (error) {
      setErrorMessage('Failed to create blog');
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  const handleLogout = () => {
    setUser(null);
    blogService.setToken(null);
    setMessage('Logged out');
    setTimeout(() => setMessage(null), 5000);
  };

  return (
    <div>
      <h1>Blog List</h1>
      <Notification message={message} />
      <Notification message={errorMessage} />
      {user === null ? (
        <LoginForm
          handleLogin={handleLogin}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          username={username}
          password={password}
        />
      ) : (
        <div>
          <p>
            {user.name} logged in <button onClick={handleLogout}>Logout</button>
          </p>
          <h2>Create New Blog</h2>
          <BlogForm
            createBlog={addBlog}
            title={newTitle}
            author={newAuthor}
            url={newUrl}
            handleTitleChange={({ target }) => setNewTitle(target.value)}
            handleAuthorChange={({ target }) => setNewAuthor(target.value)}
            handleUrlChange={({ target }) => setNewUrl(target.value)}
          />
          <h2>Blogs</h2>
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog key={blog.id} blog={blog} />
            ))}
        </div>
      )}
    </div>
  );
};

export default App;
