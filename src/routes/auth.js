const Router = require('express').Router;
const router = Router();
const User = require('../models/User');
const ensureAuth = require('../auth/ensureAuth')();
const tokenService = require('../auth/tokenService');
const bodyParser = require('body-parser').json();
const { hasEmailAndPassword, asyncIt } = require('../helpers/middleware');

router
  .get('/verify', ensureAuth, (req, res) => {
    return res.send({ valid: true });
  })
  .post('/signup', hasEmailAndPassword, asyncIt(async (req, res, next) => {
    const { email, password } = req.body;
    const exists = await User.exists({ email });
    console.log(8, exists)
    if (exists) {
      throw {code: 400, name: 'Email in use'};
    }

    let user = new User(req.body);

    const hash = await user.generateHash(password);
    const withPassword = await user.save();
    const token = await tokenService.sign(withPassword);
    console.log(55, token)
    return token;
  }))
  .post(
    '/signin',
    bodyParser,
    hasEmailAndPassword,
    asyncIt(async (req, res, next) => {
      const { email, password } = req.body;
      delete req.body.password;

      const user = await User.findOne({ email }).select();
      if (!user || !user.comparePassword(password)) {
        throw { code: 401, name: 'User not found'};
      }
      const withPassword = await tokenService.sign(user);
      return withPassword;
    })
  );

module.exports = router;
