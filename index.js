require('dotenv').config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const Person = require('./models/person');

const app = express();

app.use(express.static('dist'));
app.use(express.json());
app.use(cors());

// app.use(morgan('tiny'));

morgan.token('reqData', function (req, res) {
    return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqData'));

// let persons = [
//     {
//         "name": "Arto Hellas",
//         "number": "040-123456",
//         "id": 1
//     },
//     {
//         "name": "Ada Lovelace",
//         "number": "39-44-5323523",
//         "id": 2
//     },
//     {
//         "name": "Dan Abramov",
//         "number": "12-43-234345",
//         "id": 3
//     },
//     {
//         "name": "Mary Poppendieck",
//         "number": "39-23-6423122",
//         "id": 4
//     },
//     {
//         "name": "george",
//         "number": "304-696969",
//         "id": 5
//     },
//     {
//         "name": "brian",
//         "number": "69-69-304304",
//         "id": 6
//     },
//     {
//         "name": "boobie boobers",
//         "number": "123456",
//         "id": 7
//     },
//     {
//         "name": "texas cowboy",
//         "number": "45-50-100200",
//         "id": 8
//     },
//     {
//         "name": "uncle bob",
//         "number": "112244",
//         "id": 9
//     },
//     {
//         "name": "crayon monster",
//         "number": "22-44-395395",
//         "id": 10
//     },
//     {
//         "name": "simpsons fan",
//         "number": "12345-12345",
//         "id": 11
//     },
//     {
//         "name": "bagel",
//         "number": "246246",
//         "id": 12
//     }
// ]

// app.get('/api/persons', (request, response) => {
//     response.json(persons);
// });

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons);
    });
});

app.get('/info', (request, response) => {
    const date = new Date();
    Person.countDocuments({}).then(count => {
        response.send(`<p> Phonebook has info for ${count} people</p><p>${date}</p>`);
    });
    // const personsCount = Person.countDocuments({}, (err, count) => {
    //     return count;
    // });
    // console.log(personsCount);

    // const info = `<p> Phonebook has info for ${personsCount} people</p><p>${date}</p>`;
    // response.send(info);
});

// app.get('/info', (request, response) => {
//     const date = new Date();
//     const info = `<p>Phonebook has info for ${persons.length} people<p/><p>${date}</p>`;
//     response.send(info);
// });

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
        .then(note => {
            if (note) {
                response.json(note);
            } else {
                response.status(404).end();
            }
        })
        .catch(error => next(error));
        // .catch(error => {
        //     console.log(error);
        //     response.status(500).end();
        // })
});

// app.get('/api/persons/:id', (request, response) => {
//     const id = Number(request.params.id);
//     const note = persons.find(person => person.id === id);

//     if (note) {
//         response.json(note);
//     }
//     else {
//         response.status(404).end();
//     }
// });

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end();
        })
        .catch(error => console.log(error));
});

// app.delete('/api/persons/:id', (request, response) => {
//     const id = Number(request.params.id);
//     persons = persons.filter(person => person.id !== id);

//     response.status(204).end();
// });

app.post('/api/persons', (request, response, next) => {
    const body = request.body;

    if (body.name === undefined) {
        return response.status(400).json({ error: 'name missing'});
    }

    const person = new Person({
        name: body.name,
        number: body.number
    });

    person.save().then(savedPerson => {
        console.log(`added ${person.name} number ${person.number} to phonebook`);
        response.json(savedPerson);
        // mongoose.connection.close();
    })
    .catch(error => next(error));
});

// const generateId = () => {
//     const maxId = persons.length > 0
//         ? Math.max(...persons.map(n => n.id))
//         : 0
//     return maxId + 1;
// }

// const generateId = () => {
//     return Math.floor(Math.random() * 100000);
// }

// app.post('/api/persons', (request, response) => {
//     const body = request.body;

//     if (!body.name || !body.number) {
//         return response.status(400).json({
//             error: 'content missing'
//         });
//     }

//     if (persons.some(person => person.name.includes(body.name))) {
//         return response.status(400).json({
//             error: 'name must be unique'
//         });
//     }

//     const person = {
//         name: body.name,
//         number: body.number,
//         id: generateId(),
//     }

//     persons = persons.concat(person);

//     response.json(person);
// });

app.put('/api/persons/:id', (request, response, next) => {
    // const body = request.body;
    const { name, number } = request.body;

    Person.findByIdAndUpdate(
        request.params.id,
        { name, number },
        { new: true, runValidators: true, context: 'query'}
    )
        .then(updatedPerson => {
            response.json(updatedPerson);
        })
        .catch(error => next(error));

    // const person = {
    //     name: body.name,
    //     number: body.number,
    // }

    // console.log(request);

    // Person.findByIdAndUpdate(request.params.id, person, { new: true })
    //     .then(updatedPerson => {
    //         response.json(updatedPerson);
    //     })
    //     .catch(error => next(error));
});

// error handler middleware
const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' });
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message });
    }

    next(error);
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknonw endpoint' });
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

// this has to be the last loaded middleware
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});