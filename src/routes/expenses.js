const express = require('express');
const router = express.Router();
const jsonParser = require('body-parser').json();
const Expense = require('../models/Expense');
const Category = require('../models/Expense');

router
.post('/expense', async (req, res, next) => {
  const expense = new Expense(req.body);
  // const find = await Category.find({name: category.name});
  // if (find.length == 0) return res.send(await category.save(category));
  //   return res.send(null)
})