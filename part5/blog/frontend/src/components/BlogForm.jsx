import { useState } from 'react'

const BlogForm = ({ createBlog }) => {

    const [newTitle, setNewTitle] = useState('')
    const [newAuthor, setNewAuthor] = useState('')
    const [newUrl, setNewUrl] = useState('')

    const addBlog = (event) => {
        event.preventDefault()
        createBlog({
            title: newTitle,
            author: newAuthor,
            url: newUrl
        })

        // reset/empty up form fields
        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
    }

    return (
        <div>
            <h2>Create new blog</h2>
            <form onSubmit={addBlog}>
                <div>
                    title
                    <input
                        type="text"
                        value={newTitle}
                        name="title"
                        onChange={({ target }) => setNewTitle(target.value)}
                        required={true}
                    />
                </div>
                <div>
                    author
                    <input
                        type="text"
                        value={newAuthor}
                        name="author"
                        onChange={({ target }) => setNewAuthor(target.value)}
                        required={true}
                    />
                </div>
                <div>
                    url
                    <input
                        type="url"
                        value={newUrl}
                        name="url"
                        onChange={({ target }) => setNewUrl(target.value)}
                        required={true}
                    />
                </div>
                <button type="submit">Create blog</button>
            </form>
        </div>
    )
}

export default BlogForm