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
    // console.log(8, exists)
    if (exists) {
      throw {code: 400, name: 'Email in use'};
    }

    let user = new User(req.body);

    const hash = await user.generateHash(password);
    // console.log(44, hash)
    user.password = hash;
    const withPassword = await user.save();
    // console.log(50, withPassword)

    const tokenizedUser = await tokenService.sign(withPassword);
    tokenizedUser.user.password = null;
    // console.log(55, tokenizedUser)

    return tokenizedUser;
  }))
  .post(
    '/signin',
    asyncIt(async (req, res, next) => {
      // console.log(787878, req.body)
      const { email, password, token } = req.body;
      delete req.body.password;
      // console.log(787878, req.body)
      const user = await User.findOne({ email }).select();
      if (!user || !user.comparePassword(password)) {
        throw { code: 401, name: 'User not found'};
      }
      const withPassword = await tokenService.sign(user);
      return withPassword;
    })
  );

module.exports = router;
