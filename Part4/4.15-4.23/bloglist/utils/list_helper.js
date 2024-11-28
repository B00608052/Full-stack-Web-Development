const dummy = (blogs) => {
    return 1; 
  };
  
  const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0);
  };
  
  const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null;
    const favorite = blogs.reduce((prev, current) =>
      current.likes > prev.likes ? current : prev
    );
    return {
      title: favorite.title,
      author: favorite.author,
      likes: favorite.likes,
    };
  };
  
  const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null;
  
    const authors = blogs.reduce((acc, blog) => {
      acc[blog.author] = (acc[blog.author] || 0) + 1;
      return acc;
    }, {});
  
    const topAuthor = Object.keys(authors).reduce((a, b) =>
      authors[a] > authors[b] ? a : b
    );
  
    return {
      author: topAuthor,
      blogs: authors[topAuthor],
    };
  };
  
  const mostLikes = (blogs) => {
    if (blogs.length === 0) return null;
  
    const likes = blogs.reduce((acc, blog) => {
      acc[blog.author] = (acc[blog.author] || 0) + blog.likes;
      return acc;
    }, {});
  
    const topAuthor = Object.keys(likes).reduce((a, b) =>
      likes[a] > likes[b] ? a : b
    );
  
    return {
      author: topAuthor,
      likes: likes[topAuthor],
    };
  };
  
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
  };
  