const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const usersRouter = require('./controllers/users');
app.use('/api/users', usersRouter);

const blogsRouter = require('./routes/blogs');

const app = express();

const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use('/api/blogs', blogsRouter);

module.exports = app;
