const Router = require('express').Router;
const router = Router();
const User = require('../models/User');
const ensureAuth = require('../auth/ensureAuth')();
const tokenService = require('../auth/tokenService');
const bodyParser = require('body-parser').json();

function hasEmailAndPassword(req, res, next) {
  const user = req.body;
  if (!user || !user.email || !user.password) {
    return next({
      code: 400,
      error: 'name, email, and password must be supplied'
    });
  }
  next();
}

router
  .get('/verify', ensureAuth, async (req, res) => {
    return res.send({ valid: true });
  })
  .post('/signup', bodyParser, hasEmailAndPassword, async (req, res, next) => {
    const { name, email, password } = req.body;
    delete req.body.password;

    const userExists = await User.exists({ email });
    if (userExists === true) {
    return res.sendStatus(400);
    }

    const user = new User({ name, email });
    user.password = await user.generateHash(password);
    const savedUser = await user.save();
    const token = await tokenService.sign(savedUser);
    return res.send( {token} );
  })
  .post('/signin', bodyParser, hasEmailAndPassword, async (req, res, next) => {
    const { email, password } = req.body;
    delete req.body.password;
    console.log(555, email, password)

    User.findOne({ email })
    .select()
    .then(user => {
      if (!user || !user.comparePassword(password)) {
        throw next({
          code: 401,
          name: 'User not found'
        });
      }
      return user;
    })
    .then(withPassword => {
      return tokenService.sign(withPassword);
    })
    .then(token => {
      return res.send(token);
    })
    .catch(next);
  });

module.exports = router;
