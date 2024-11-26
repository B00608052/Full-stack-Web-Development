import mongoose from 'mongoose';

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>');
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://b00608052:${password}@b00608052.iu8ks.mongodb.net/phonebook?retryWrites=true&w=majority&appName=b00608052`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
  Person.find({})
    .then(result => {
      console.log('Phonebook:');
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`);
      });
      mongoose.connection.close();
    })
    .catch(err => {
      console.error(err);
      mongoose.connection.close();
    });
}

if (process.argv.length === 5) {
  const person = new Person({
    name,
    number,
  });

  person
    .save()
    .then(() => {
      console.log(`Added ${name} number ${number} to phonebook`);
      mongoose.connection.close();
    })
    .catch(err => {
      console.error(err);
      mongoose.connection.close();
    });
}
