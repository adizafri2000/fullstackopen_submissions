const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

const app = express()

const morganLogger = morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'),
    '-',
    tokens['response-time'](req, res),
    'ms',
    (Object.keys(req.body).length!==0 ? JSON.stringify(req.body) : '')
  ].join(' ')
})

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))
app.use(morganLogger)

app.get('/', (request, response) => {
  response.status(200).end()
})

app.get('/info', (request, response) => {
  Person
    .count({})
    .then(count => {
      const timeStamp = new Date().toString()
      response.send(`<p>Phonebook has info for ${count} people</p><p>${timeStamp}</p>`)
    })
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person
    .findById(request.params.id)
    .then(person => {
      if (person)
        response.json(person)
      else
        response.status(404).end()
    })
    .catch( error => {
      console.log(error)
      next(error)
    })
})

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body

  Person
    .find({ name:name })
    .then(person => {
      console.log('Checking person: ',person)
      if (person.length>0)
        response.status(400).json({
          error: `${name} already exists. Name must be unique`
        })
      else{
        const newPerson = new Person({ name, number })

        newPerson
          .save()
          .then(() => {
            response.json(newPerson)
          })
          .catch(error => next(error))
      }
    })


})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body
  const person = { name, number }

  Person
    .findByIdAndUpdate(
      request.params.id,
      person,
      { new: true, runValidators: true, context: 'query' }
    )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})