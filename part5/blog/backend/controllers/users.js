const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User
        .find({}).populate('blogs', {
            title: 1,
            author: 1,
            url: 1
        })

    response.json(users)
})

usersRouter.get('/:id', async (request, response) => {
    const user = await User
        .findById(request.params.id).populate('blogs', {
            title: 1,
            author: 1,
            url: 1
        })

    response.json(user)
})

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body

    if(!password || password.length<3)
        return response.status(400).json({
            error: 'Password must be given with minimum length of 3 characters long'
        })

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash,
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
})

module.exports = usersRouter