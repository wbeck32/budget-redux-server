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
    if (userExists) {
      throw { code: 400, error: 'email in use' };
    }

    const user = new User({ name, email });
    await user.generateHash(password);
    const savedUser = await user.save();
    const userToken = await tokenService.sign(user);
    return res.send({ userToken });
  })
  .post('/signin', bodyParser, hasEmailAndPassword, async (req, res, next) => {
    const { email, password } = req.body;
    delete req.body.password;

    const findUser = await User.findOne({ email });

    if (!findUser || !user.comparePassword(password)) {
      throw { code: 401, error: 'Invalid Login' };
      return user;
    }

    const userToken = await tokenService.sign(user);
    return res.send({ userToken });
  });

module.exports = router;
