const connection = require('mongoose').connection;
const request = require('./request');

/* export a small helper for dropping the db*/
module.exports = {
    drop() {
        return connection.dropDatabase();
    },
    getToken(user = { email: 'token@token.com', password: 'token', name:'token user' }) {
        return request.post('/api/auth/signup')
            .send(user)
            .then(res => res.body.token);
    }
};