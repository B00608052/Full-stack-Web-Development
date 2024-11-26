require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const Person = require('./models/person');

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

app.get('/api/persons', (req, res) => {
  Person.find({})
    .then(persons => res.json(persons))
    .catch(error => {
      console.error(error);
      res.status(500).end();
    });
});

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: 'name or number is missing' });
  }

  const person = new Person({ name, number });

  person.save()
    .then(savedPerson => res.json(savedPerson))
    .catch(error => {
      console.error(error);
      res.status(500).end();
    });
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
