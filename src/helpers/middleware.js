module.exports = {
  asyncIt(fn) {
    return function(req, res, next) {
      fn(req)
        .then(returnedVal => res.send(returnedVal))
        .catch(next);
    };
  },

  hasEmailAndPassword(req, res, next) {
    const user = req.body;
    if (!user || !user.email || !user.password) {
      return next({
        code: 400,
        error: 'name, email, and password must be supplied'
      });
    }
    next();
  }
};
