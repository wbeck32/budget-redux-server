require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const ensureAuth = require('./auth/ensureAuth')
// const errorHandler = require('./error-handler');
const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static('../public'));

const me = require('./routes/me');
const auth = require('./routes/auth');
const expenses = require('./routes/expenses');

app.use('/api/auth', auth);
app.use('/api/me', ensureAuth, me);
app.use('/api', expenses);

module.exports = app;
