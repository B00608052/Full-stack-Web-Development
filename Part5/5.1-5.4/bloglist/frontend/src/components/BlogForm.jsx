import { useState } from 'react'

const BlogForm = ({ addBlog }) => {
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

  const handleSubmit = (event) => {
    event.preventDefault()
    addBlog(newBlog)
    setNewBlog({ title: '', author: '', url: '' })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Title"
        value={newBlog.title}
        onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
      />
      <input
        placeholder="Author"
        value={newBlog.author}
        onChange={(e) => setNewBlog({ ...newBlog, author: e.target.value })}
      />
      <input
        placeholder="URL"
        value={newBlog.url}
        onChange={(e) => setNewBlog({ ...newBlog, url: e.target.value })}
      />
      <button type="submit">Create</button>
    </form>
  )
}

export default BlogForm
