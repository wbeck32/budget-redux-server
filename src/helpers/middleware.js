module.exports = {
  asyncIt(fn) {
    return function(req, res, next) {
      fn(req)
        .then(returnedVal => {
          res.send(returnedVal);
        })
        .catch(next);
    };
  },

  hasEmailAndPassword(req, res, next) {
    const user = req.body;
    if (!user || !user.email || !user.password) {
      const err = {
        code: 400,
        name: 'Name, email, and password must be supplied'
      };
      throw err;
    }
    next();
  }
};
