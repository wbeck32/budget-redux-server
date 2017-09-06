const express = require('express');
const router = express.Router();
const jsonParser = require('body-parser').json();
const Expense = require('../models/Expense');
const Category = require('../models/Expense');

router
  .post('/expense', async (req, res, next) => {
    const expense = new Expense(req.body);
  })
  .get('/expense', async (req, res, next) => {})
  .patch('/expense/:id', async (req, res, next) => {})
  .delete('/expense/:id', async (req, res, next) => {})
  .use(jsonParser);

  module.exports = router;