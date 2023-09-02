const mongoose = require('mongoose');

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://fullstack:${password}@cluster0.ijg0dkg.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model('Person', personSchema);

const person = new Person({
    name: name,
    number: number,
});

const savePerson = (person) => person.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
});

if (process.argv.length === 3) {
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person);
        });
        mongoose.connection.close();
    });
}
else if (process.argv.length < 5 && process.argv.length !== 3) {
    console.log("give password, name, and number as arguments");
    process.exit(1);
}

if (process.argv.length === 5) {
    savePerson(person);
}

// const note = new Note({
//     content: 'HTML is easy',
//     important: true,
// });

// const note1 = new Note({
//     content: 'CSS is hard',
//     important: true,
// });

// const note2 = new Note({
//     content: 'Mongoose makes things easy',
//     important: true,
// });

// note.save().then(result => {
//     console.log('note saved!');
//     mongoose.connection.close();
// });

// note1.save().then(result => {
//     console.log('note1 saved!');
//     mongoose.connection.close();
// });

// note2.save().then(result => {
//     console.log('note2 saved!');
//     mongoose.connection.close();
// });

// Person.find({}).then(result => {
//     result.forEach(person => {
//         console.log(person);
//     });
//     mongoose.connection.close();
// });