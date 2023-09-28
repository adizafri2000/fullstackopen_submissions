const express = require('express')
const morgan = require('morgan')
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
app.use(morganLogger)

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        number: "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.status(200).end()
})

app.get('/info', (request, response) => {
    const totalPeople = persons.length
    const timeStamp = new Date().toString()
    response.send(`<p>Phonebook has info for ${totalPeople} people</p><p>${timeStamp}</p>`)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person)
        response.json(person)
    else
        response.status(404).end()

})

const generateId = () => {

    const min = Math.ceil(0)
    const max = Math.floor(9999999998)
    return Math.floor(Math.random() * (max - min) + min)

    // const maxId = persons.length > 0
    //     ? Math.max(...persons.map(n => n.id))
    //     : 0
    // return maxId + 1
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log(body)

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }

    if(persons.find(p => p.name===body.name))
        return response.status(400).json({
            error: `${body.name} already exists. Name must be unique`
        })

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    let idExists = true
    while(idExists){
        if(persons.find(p=> p.id===person.id)) {
            console.log(`Current person is assigned used ID of ${p.id}===${person.id}. Assigning new ID`)
            person.id = generateId()
        }
        else
            idExists=false
    }

    persons = persons.concat(person)
    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})