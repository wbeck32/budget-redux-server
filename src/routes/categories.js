const express = require('express');
const router = express.Router();
const jsonParser = require('body-parser').json();
const Category = require('../models/Category');

router
  .post('/category', async (req, res, next) => {
    const category = new Category(req.body);
    const find = await Category.find({ name: category.name });
    if (find.length == 0) return res.send(await category.save(category));
    return res.send(null);
  })
  .get('/category', async (req, res, next) => {
    const allCats = await Category.find();
    return res.send(allCats);
  })
  .get('/category/:id', async (req, res, next) => {
    const {id} = req.query;
    const catById = await Category.findById({_id: id});
    res.send(catById);
  })
  .patch('/category/:id', async (req, res, next) => {})
  .delete('/category/:id', async (req, res, next) => {})
  .use(jsonParser);

module.exports = router;
