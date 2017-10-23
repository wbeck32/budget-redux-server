const Router = require('express').Router;
const router = Router();
const User = require('../models/User');
const ensureAuth = require('../auth/ensureAuth')();
const tokenService = require('../auth/tokenService');
const bodyParser = require('body-parser').json();
const asyncIt = require('../helpers/async')

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
  .get('/verify', ensureAuth, (req, res) => {
    return res.send({ valid: true });
  })
  .post('/signup', hasEmailAndPassword, asyncIt, async (req, res, next) => {
    const { email, password } = req.body;
    const exists = User.exists({ email });

    if (exists) {
      throw next({
        code: 400,
        name: 'email in use'
      });
    }

    let user = new User(req.body);
    const hash = user.generateHash(password);
    const withPassword = await user.save();
    const token = tokenService.sign(withPassword);
    return token;
  })
  .post(
    '/signin',
    bodyParser,
    hasEmailAndPassword,
    asyncIt(async (req, res, next) => {
      const { email, password } = req.body;
      delete req.body.password;

      const user = await User.findOne({ email }).select();
      if (!user || !user.comparePassword(password)) {
        throw next({
          code: 401,
          name: 'User not found'
        });
      }
      const withPassword = await tokenService.sign(user);
      return withPassword;
    })
  );

module.exports = router;
