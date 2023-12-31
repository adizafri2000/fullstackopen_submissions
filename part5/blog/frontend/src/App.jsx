import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs.jsx'
import loginService from './services/login.jsx'
import Togglable from './components/Togglable.jsx'
import BlogForm from './components/BlogForm.jsx'

const App = () => {
    // blog and metadata in forms
    const [blogs, setBlogs] = useState([])

    // notification
    const [messageColour, setMessageColour] = useState('green')
    const [notificationMessage, setNotificationMessage] = useState(null)
    const successColour = 'green'
    const failedColour = 'red'

    // auth
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)

    const blogFormRef = useRef()

    useEffect( () => {
        blogService.getAll().then(blogs =>
            setBlogs( blogs.sort((a,b) => a.likes-b.likes) )
        )
    }, [])

    // check for any user login tokens stored in browser local storage
    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedblogappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

    const handleLogin = async (event) => {
        event.preventDefault()

        try {
            const user = await loginService.login({
                username, password,
            })
            // // save user login token to local storage
            window.localStorage.setItem(
                'loggedblogappUser', JSON.stringify(user)
            )

            // // set user token for blog services esp. blog creation
            blogService.setToken(user.token)

            setUser(user)
            setUsername('')
            setPassword('')
        } catch (exception) {
            setMessageColour(failedColour)
            setNotificationMessage('wrong username or password')
            setTimeout(() => {
                setNotificationMessage(null)
            }, 5000)
        }
    }

    const loginForm = () => (
        <div>
            <h2>Log in to application</h2>
            <form onSubmit={handleLogin}>
                <div>
            username
                    <input
                        type="text"
                        value={username}
                        name="Username"
                        onChange={({ target }) => setUsername(target.value)}
                    />
                </div>
                <div>
            password
                    <input
                        type="password"
                        value={password}
                        name="Password"
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </div>
                <button type="submit">login</button>
            </form>
        </div>
    )

    const addBlog = async (blogObject) => {
        blogFormRef.current.toggleVisibility()

        const response = await blogService.create(blogObject)
        setBlogs(blogs.concat(response))
        setMessageColour(successColour)
        setNotificationMessage(`a new blog ${response.title} by ${response.author} is added`)
        setTimeout(() => {
            setNotificationMessage(null)
        }, 5000)
    }

    const likeBlog = async (id) => {
        const blog = blogs.find(b => b.id===id)
        const changedBlog = { ...blog, likes: blog.likes+1 }
        await blogService.update(id, changedBlog)
        setBlogs(blogs.map(blog => blog.id===id ? changedBlog : blog))
    }

    const deleteBlog = async id => {
        await blogService.remove(id)
        setBlogs(blogs.filter(blog => blog.id !== id))
    }

    const blogForm = () => (
        <Togglable buttonLabel='New Blog' ref={blogFormRef}>
            <BlogForm createBlog={addBlog}/>
        </Togglable>
    )

    const logoutHandler = () => {
        window.localStorage.removeItem('loggedblogappUser')
        setUser(null)
        setMessageColour(successColour)
        setNotificationMessage('Successfully logged out!')

        setTimeout(() => {
            setNotificationMessage(null)
        }, 3000)
    // window.location.reload()
    }

    return (
        <div>
            <h2>blogs</h2>

            { (notificationMessage) && <Notification message={notificationMessage} color={messageColour} /> }

            {/*if user state is null (no user logged in), display login form*/}
            {!user && loginForm()}

            {/*if a user has logged in (user state not null), display name and create new blog form*/}
            {user && <div>
                <p>{user.name} logged in</p>
                <button onClick={logoutHandler}>logout</button>
            </div>
            }

            {user && blogForm()}
            {user && blogs.map(blog =>
                <Blog key={blog.id} blog={blog} updateBlog={likeBlog} deleteBlog={deleteBlog} username={user.username} name={user.name}/>
            )}
        </div>
    )
}

export default App