const express = require('express');
const router = express.Router();
const jsonParser = require('body-parser').json();
const Category = require('../models/Category');
const ObjectId = require('mongoose').Types.ObjectId;

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
  .get('/category/:cid', async (req, res, next) => {
    const { cid } = req.params;
    const catById = await Category.findById({ _id: cid });
    res.send(catById);
  })
  .patch('/category/:cid', jsonParser, async (req, res, next) => {
    const newSubcategory = req.body;
    const { cid } = req.params;
    const newSubcat = await Category.update(
      { _id: cid },
      { $addToSet: { subCategories: newSubcategory } },
      { new: true, runValidators: true }
    );
    return res.send(newSubcat);
  })
  .patch(
    '/category/:cid/subcategory/:sid',
    jsonParser,
    async (req, res, next) => {
      const { body } = req;
      const { cid, sid } = req.params;
      const update = {};

      if (body.subName) {
        update['subCategories.$.subName'] = body.subName;
      }
      if (body.subAmount) {
        update['subCategories.$.subCatAmount'] = body.subAmount;
      }

      const updatedSubcat = await Category.update(
        { 'subCategories._id': ObjectId(sid) },
        { $set: update }
      );
      return res.send(updatedSubcat);
    }
  )
  .delete('/category/:id', async (req, res, next) => {
    const { id } = req.params;
    const deleted = await Category.deleteOne({ _id: id });
    return res.send(deleted);
  })
  .use(jsonParser);

module.exports = router;
