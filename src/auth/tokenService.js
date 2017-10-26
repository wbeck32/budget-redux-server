const jwt = require('jsonwebtoken-promisified');
const appSecret = process.env.APP_SECRET || 'change-me';

module.exports = {
  async sign(user) {
    const payload = { user };
    const token = await jwt.signAsync(payload, appSecret, { expiresIn: '14d' });
    user.auth = token;
    return { user, token };
  },
  async verify(token) {
    const verifiedUser = await jwt.verifyAsync(token, appSecret);
    console.log(90090, verifiedUser)
    if (verifiedUser) return verifiedUser;
    throw { code: 401, name: 'Verification failed' };
  }
};
