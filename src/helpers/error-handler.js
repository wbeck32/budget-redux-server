// eslint-disable-next-line
function getErrorHandler(log=console.log) {

    // eslint-disable-next-line
    return function errorHandler(err, req, res, next) {
      log(345, err)
      let error = {code: '', name: ''};
      if (err.name === 'ValidationError') {
        error.code = 400;
        const { errors } = err;
        error.name = Object.keys(errors).map(key => errors[key].name);
        log(error);
      }
      else if (err.name === 'CastError') {
        error.code = 400;
        error.name = err.name;
        log(error);
      }
      else if (err.name === 'Email in use') {
        error.code = 400;
        error.name = err.name;
        log(error);
      }
      else if (err.name == 'Both email and password are required.') {
        error.code = err.code,
        error.name = err.name;
        log(error);
      }
      else if (err.code) {
        error.code = err.code;
        error.name = err.name;
        log(error);
      }
      else {
        error.code = 500;
        error.name = 'Internal Server Error';
        log(error);
      }
      return res.status(error.code).send(error);
    };
  }

  module.exports = getErrorHandler;
