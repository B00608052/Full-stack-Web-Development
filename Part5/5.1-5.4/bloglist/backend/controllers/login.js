const loginRouter = require('express').Router();
const User = require('../models/user');

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body;

  const user = await User.findOne({ username });

  if (!(user && user.password === password)) {
    return response.status(401).json({ error: 'invalid username or password' });
  }

  response.status(200).send({
    username: user.username,
    name: user.name,
  });
});

module.exports = loginRouter;
