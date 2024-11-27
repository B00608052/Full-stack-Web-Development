const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const blogsRouter = require('./routes/blogs');

const app = express();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use('/api/blogs', blogsRouter);

module.exports = app;
