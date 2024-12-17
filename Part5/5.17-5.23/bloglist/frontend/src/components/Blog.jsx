import React from "react";
import PropTypes from "prop-types";

const Blog = ({ blog, handleLike, handleDelete }) => {
  const blogStyle = {
    padding: 10,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle}>
      <div className="blog-title-author">{blog.title} {blog.author}</div>
      <button onClick={() => handleLike(blog)}>like</button>
      <button onClick={() => handleDelete(blog)}>remove</button>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    likes: PropTypes.number,
  }).isRequired,
  handleLike: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default Blog;
