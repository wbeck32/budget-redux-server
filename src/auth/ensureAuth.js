/* eslint no-console: off */
const tokenService = require('./tokenService');

module.exports = function ensureAuth(log = console.log) {
  return (
    ensureAuth,
    async (req, res, next) => {
      const token =
        (await req.get('Authorization')) || req.get('authorization');
      if (!token) return next({ code: 401, error: 'No Authorization Found' });

      const payload = await tokenService.verify(token);

      return (
        payload => {
          req.user = payload;
          next();
        },
        () => {
          next({ code: 401, error: 'Authorization Failed' });
        }
      );
    }
  );
};
