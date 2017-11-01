const tokenService = require('./tokenService');

// eslint-disable-next-line
module.exports = function getEnsureAuth() {
    return function ensureAuth(req, res, next) {
        const token = req.get('Authorization');
        if(!token) {
            throw { code: 401, name: 'No authorization found' };
        }

        tokenService.verify(token)
            .then(payload => {
                req.user = payload;
                next();
            })
            .catch(() => {
                throw { code: 401, error: 'Authorization failed' };
            });
    };

};
