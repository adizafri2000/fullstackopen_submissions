const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const Blog = require('../models/blog')
const { initialBlogs } = require('./test_helper')

describe('auth api testing', () => {

    beforeEach(async () => {
        await Blog.deleteMany({})
        await User.deleteMany({})

        for (let user of helper.initialUsers) {
            let { username, name, password } = user
            await helper.createNewUser(username, name, password)

            const response = await api
                .post('/api/login')
                .send({ username, password })

            const token = `Bearer ${response.body.token}`

            for (let blog of helper.initialBlogs) {
                blog.author = name
                await api
                    .post('/api/blogs')
                    .set('Authorization', token)
                    .send(blog)
            }
        }
    })

    test('users are returned as json', async () => {
        await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    }, 100000)

    test('all users are returned', async () => {
        const response = await api.get('/api/users')
        expect(response.body).toHaveLength(helper.initialUsers.length)
    })

    test('all users contain an id property', async () => {
        const response = await api.get('/api/users')
        response.body.forEach(user => {
            expect(user.id).toBeDefined()
        })
    })

    test('a specific user is within the returned users', async () => {
        const response = await api.get('/api/users')
        const contents = response.body.map(user => user.name)
        expect(contents).toContain(
            'Kenny McCormick'
        )
    })

    test('a valid user can be added', async () => {
        const newUser = {
            username: 'butters',
            name: 'Leopold Stotch',
            password: 'butters'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDB()
        expect(usersAtEnd).toHaveLength(helper.initialUsers.length + 1)

        const names = usersAtEnd.map(user => user.name)
        expect(names).toContain(
            'Leopold Stotch'
        )
    })

    test('creating a user without passing a username returns 400 error', async () => {
        const newUser = {
            name: 'Leopold Stotch',
            password: 'butters'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAtEnd = await helper.usersInDB()
        expect(usersAtEnd).toHaveLength(helper.initialUsers.length)
    })

    test('creating a user without passing a password returns 400 error', async () => {
        const newUser = {
            username: 'butters',
            name: 'Leopold Stotch'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAtEnd = await helper.usersInDB()
        expect(usersAtEnd).toHaveLength(helper.initialUsers.length)
    })

    test('creating a user with username less than 3 characters returns 400 error', async () => {
        const newUser = {
            username: 'bu',
            name: 'Leopold Stotch',
            password: 'butters'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAtEnd = await helper.usersInDB()
        expect(usersAtEnd).toHaveLength(helper.initialUsers.length)
    })

    test('creating a user with password less than 3 characters returns 400 error', async () => {
        const newUser = {
            username: 'butters',
            name: 'Leopold Stotch',
            password: 'bu'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAtEnd = await helper.usersInDB()
        expect(usersAtEnd).toHaveLength(helper.initialUsers.length)
    })

    test('login with non-existing/incorrect username/password/combination returns 401 error', async () => {
        const nonExistingUser = {
            username: 'manbearpig',
            password: 'manbearpig'
        }

        await api
            .post('/api/login')
            .send(nonExistingUser)
            .expect(401)
    })

    test('login with existing username returns 200', async () => {

        const testMeInstead = helper.initialUsers[0]
        delete testMeInstead.name

        await api
            .post('/api/login')
            .send(testMeInstead)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('creating a blog without token returns 401 error', async () => {
        const testBlog = { ...helper.initialBlogs[0], title: 'Running a test case' }

        await api
            .post('/api/blogs')
            .send(testBlog)
            .expect(401)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(initialBlogs.length * 4)
    })

    test('creating a blog with invalid token returns 401 error', async () => {
        const testBlog = { ...helper.initialBlogs[0], title: 'Running a test case' }

        const testUser = helper.initialUsers[0]

        const response = await api
            .post('/api/login')
            .send(testUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const normalToken = response.body.token

        const editedToken = normalToken.slice(0,-1) + '#'

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${editedToken}`)
            .send(testBlog)
            .expect(401)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length * 4)
    })

    test('creating a blog with expired token returns 401 error', async () => {
        const testBlog = { ...helper.initialBlogs[0], title: 'Running a test case' }

        const token = helper.expiredToken

        const response = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(testBlog)
            .expect(401)
            .expect('Content-Type', /application\/json/)

        expect(response.body).toEqual({
            error: 'token expired'
        })

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length * 4)
    })

    test('a blog can be created by passing a token', async () => {
        const testBlog = { ...helper.initialBlogs[0], title: 'Running a test case' }

        const testUser = helper.initialUsers[0]

        const response = await api
            .post('/api/login')
            .send(testUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const token = `Bearer ${response.body.token}`

        await api
            .post('/api/blogs')
            .set('Authorization', token)
            .send(testBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length * 4 + 1)
    })

    test('deleting a blog without token returns 401 error', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const targetBlog = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${targetBlog.id}`)
            .expect(401)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length * 4)
    })

    test('deleting a blog someone else\'s token returns 403 error', async () => {
        const testUser = helper.initialUsers[1]
        const blogsAtStart = await helper.blogsInDb()
        const targetBlog = blogsAtStart[0]

        const response = await api
            .post('/api/login')
            .send(testUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const token = `Bearer ${response.body.token}`

        await api
            .delete(`/api/blogs/${targetBlog.id}`)
            .set('Authorization', token)
            .expect(403)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length * 4)
    })

    test('a blog can be deleted with the original owner\'s id token', async () => {
        const testUser = helper.initialUsers[0]
        const blogsAtStart = await helper.blogsInDb()
        const targetBlog = blogsAtStart[0]

        const response = await api
            .post('/api/login')
            .send(testUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const token = `Bearer ${response.body.token}`

        await api
            .delete(`/api/blogs/${targetBlog.id}`)
            .set('Authorization', token)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length * 4 - 1)
    })

    afterAll(async () => {
        await mongoose.connection.close()
    })
})

describe('api testing', () => {

    beforeEach(async () => {
        await Blog.deleteMany({})

        for (let blog of helper.initialBlogs) {
            let blogObject = new Blog(blog)
            await blogObject.save()
        }
    })

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    }, 100000)

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('all blogs contain an id property', async () => {
        const response = await api.get('/api/blogs')
        response.body.forEach(blog => {
            expect(blog.id).toBeDefined()
        })
    })

    test('a specific blog can be viewed via ID', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToView = blogsAtStart[0]

        const resultBlog = await api
            .get(`/api/blogs/${blogToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(resultBlog.body).toEqual(blogToView)
    })

    test('a specific blog is within the returned blogs', async () => {
        const response = await api.get('/api/blogs')
        const contents = response.body.map(r => r.title)
        expect(contents).toContain(
            'TDD harms architecture'
        )
    })

    test('a valid blog can be added', async () => {
        const newBlog = {
            title:  'Optimizing the beforeEach function',
            author: 'Kim Chaewon',
            url: 'https://fullstackopen.com/en/part4/testing_the_backend#optimizing-the-before-each-function',
            likes: helper.generateRandomInt()
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

        const titles = blogsAtEnd.map(b => b.title)
        expect(titles).toContain(
            'Optimizing the beforeEach function'
        )
    })

    test('a blog without defined likes has it defaulted to 0', async () => {
        const newBlog = {
            title: 'Sample title',
            author: 'Sample author',
            url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html'
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

        expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toBe(0)
    })

    test('blog without title is not added', async () => {
        const newBlog = {
            author: 'Michael Chan',
            url: 'https://reactpatterns.com/',
            likes: helper.generateRandomInt()
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('blog without url is not added', async () => {
        const newBlog = {
            title: 'Sample title',
            author: 'Michael Chan',
            likes: helper.generateRandomInt()
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('a blog can be updated', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = { ...blogsAtStart[0], title:'The title is updated' }

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(blogToUpdate)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        const titles = blogsAtEnd.map(b => b.title)
        expect(titles).toContain(blogToUpdate.title)
    })

    test('a blog can be deleted', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(
            helper.initialBlogs.length - 1
        )

        const contents = blogsAtEnd.map(b => b.title)

        expect(contents).not.toContain(blogToDelete.title)
    })

    afterAll(async () => {
        await mongoose.connection.close()
    })
})
