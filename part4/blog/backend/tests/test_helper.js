const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const initialUsers = [
    {
        username: 'eric',
        name: 'Eric Cartman',
        password: 'eric'
    },
    {
        username: 'stan',
        name: 'Stan Marsh',
        password: 'stan'
    },
    {
        username: 'kyle',
        name: 'Kyle Broflovski',
        password: 'kyle'
    },
    {
        username: 'kenny',
        name: 'Kenny McCormick',
        password: 'kenny'
    },
]

const initialBlogs = [
    {
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7
    },
    {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5
    }
]

const oldInitialBlogs = [
    {
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7
    },
    {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5
    },
    {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12
    },
    {
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10
    },
    {
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0
    },
    {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2
    }
]

const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImtpYW5hIiwiaWQiOiI2NTFiZGIxOTE3YWI3YjBhY2VmNmUwM2EiLCJpYXQiOjE2OTYzMjYxNTksImV4cCI6MTY5NjMyNjE4OX0.ysz6g4sPHrhUi3AjvavYJcCXpX8yHWHKs2BMJBMH2AI'

const nonExistingId = async () => {
    const blog = new Blog({ title: 'willremovethissoon' })
    await blog.save()
    await blog.deleteOne()

    return blog._id.toString()
}

const usersInDB = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const generateRandomInt = (min=0, max=100) => {
    return Math.floor(Math.random() * (max-min+1)) + min
}

const createNewUser = async (username, name, password) => {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash,
    })

    await user.save()
}

module.exports = {
    initialBlogs,
    initialUsers,
    nonExistingId,
    usersInDB,
    blogsInDb,
    generateRandomInt,
    createNewUser,
    expiredToken
}
