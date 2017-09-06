require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
// const errorHandler = require('./error-handler');
const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static('../public'));

const categories = require('./routes/categories');
const expenses = require('./routes/expenses');

app.use('/api', categories);
app.use('/api', expenses);

module.exports = app;
