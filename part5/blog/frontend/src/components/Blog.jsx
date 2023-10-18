import { useState } from 'react'

const Blog = (props) => {
    const { blog, updateBlog, deleteBlog, username, name } = props
    const [showDetails, setShowDetails] = useState(false)

    const toggleVisibility = () => {
        setShowDetails(!showDetails)
    }

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    const handleBlogDeletion = () => {
        const { id, title, author } = blog
        const flag = window.confirm(`Confirm removal of blog '${title}' by ${author}?`)
        if (flag){
            console.log(`Deleting ${title} by ${author} (id: ${id})`)
            deleteBlog(id)
        }
        else
            console.log('Cancelled deletion')
    }

    const blogFullDetails = () => {
        return (
            <div>
                <div>{blog.url}</div>
                <div>likes {blog.likes} <button onClick={() => updateBlog(blog.id)}>like</button></div>
                {
                    blog.user.name ?
                        <div>{blog.user.name}</div> :
                        <div>{name}</div>
                }
                {(blog.user.username===username) && <button onClick={handleBlogDeletion}>remove</button>}
            </div>
        )
    }


    return (
        <div style={blogStyle}>
            <div>
                {blog.title} by {blog.author} <button onClick={() => toggleVisibility()}>{showDetails===false ? 'view' : 'hide'}</button>
            </div>
            {showDetails===true && blogFullDetails()}
        </div>
    )
}

export default Blog