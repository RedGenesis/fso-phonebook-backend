const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();

app.use(express.json());
app.use(cors());

// app.use(morgan('tiny'));

morgan.token('reqData', function (req, res) {
    return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqData'));

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    },
    {
        "name": "george",
        "number": "304-696969",
        "id": 5
    },
    {
        "name": "brian",
        "number": "69-69-304304",
        "id": 6
    },
    {
        "name": "boobie boobers",
        "number": "123456",
        "id": 7
    },
    {
        "name": "texas cowboy",
        "number": "45-50-100200",
        "id": 8
    },
    {
        "name": "uncle bob",
        "number": "112244",
        "id": 9
    },
    {
        "name": "crayon monster",
        "number": "22-44-395395",
        "id": 10
    },
    {
        "name": "simpsons fan",
        "number": "12345-12345",
        "id": 11
    },
    {
        "name": "bagel",
        "number": "246246",
        "id": 12
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons);
});

app.get('/info', (request, response) => {
    const date = new Date();
    const info = `<p>Phonebook has info for ${persons.length} people<p/><p>${date}</p>`;
    response.send(info);
});

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const note = persons.find(person => person.id === id);

    if (note) {
        response.json(note);
    }
    else {
        response.status(404).end();
    }
});

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);

    response.status(204).end();
});

// const generateId = () => {
//     const maxId = persons.length > 0
//         ? Math.max(...persons.map(n => n.id))
//         : 0
//     return maxId + 1;
// }

const generateId = () => {
    return Math.floor(Math.random() * 100000);
}

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        });
    }

    if (persons.some(person => person.name.includes(body.name))) {
        return response.status(400).json({
            error: 'name must be unique'
        });
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    persons = persons.concat(person);

    response.json(person);
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});