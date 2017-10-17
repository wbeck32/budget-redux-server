const express = require('express');
const router = express.Router();
const jsonParser = require('body-parser').json();
const mongoose = require('mongoose');
const Category = require('../models/Category');
const User = require('../models/User');
const ObjectId = require('mongoose').Types.ObjectId;

router
  .post('/category', (req, res, next) => {
    const iD = req.user.id;

    const category = new Category(req.body);
    category.user = iD;
    return category.save().then(savedCat => {
      return User.findOneAndUpdate(
        { _id: iD },
        { $push: { categories: savedCat._id } },
        { new: true, runValidators: true }
      ).then(newCat => {
        return res.send(newCat);
      });
    });
  })
  .get('/category', (req, res, next) => {
    const userId = req.user.id;
    console.log(9898, userId);
    return Category.find({ _id: userId }).then(allCats => {
      console.log(989898, allCats);

      return res.send(allCats);
    });
  })
  .get('/category/:cid', async (req, res, next) => {
    const { cid } = req.params;
    const catById = await Category.findById({ _id: cid });
    res.send(catById);
  })
  .patch('/category/:cid', jsonParser, async (req, res, next) => {
    const newSubcategory = req.body;
    const { cid } = req.params;
    const findSubcat = await Category.findOne({
      _id: cid,
      subCategories: {
        subName: newSubcategory.subName,
        subCatAmount: newSubcategory.subCatAmount
      }
    }).count();
    if (findSubcat === 0) {
      const saveSubcat = await Category.findOneAndUpdate(
        { _id: cid },
        { $push: { subCategories: newSubcategory } },
        { new: true, runValidators: true }
      );
      return res.send(saveSubcat);
    }
    return res.send(null);
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
      if (body.subCatAmount) {
        update['subCategories.$.subCatAmount'] = body.subCatAmount;
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
