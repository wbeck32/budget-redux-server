const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const Category = require('./Category');

const RequiredString = {
    type: String,
    required: true
};

const userSchema = new Schema({
    name: RequiredString,
    email: RequiredString,
    password: RequiredString,
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }]
});

userSchema.static('exists', function (query) {
    return this.find(query)
        .count()
        .then(count => (count > 0));
});

userSchema.method('generateHash', function (password) {
    return this.hash = bcrypt.hashSync(password, 8);
});

userSchema.method('comparePassword', function (password) {
    return bcrypt.compare(password, this.password);
});

module.exports = mongoose.model('User', userSchema);