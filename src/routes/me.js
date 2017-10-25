const express = require('express');
const router = express.Router();
const jsonParser = require('body-parser').json();
const mongoose = require('mongoose');
const Category = require('../models/Category');
const User = require('../models/User');
const ObjectId = require('mongoose').Types.ObjectId;
const { hasEmailAndPassword, asyncIt } = require('../helpers/middleware');

router
  .post(
    '/category',
    asyncIt(async (req, res, next) => {
      const iD = req.user.user._id;
      const category = new Category(req.body);
      category.user = iD;
      const savedCat = await category.save();
      const updatedUser = await User.findOneAndUpdate(
        { _id: iD },
        { $push: { categories: savedCat._id } },
        { new: true, runValidators: true }
      );
      const userCats = await Category.find([
        { $match: { user: iD } },
        { $project: { name: 1, catAmount: 1, catRemaining: 1 } }
      ]);
      return userCats;
    })
  )
  .get(
    '/category',
    asyncIt(async (req, res, next) => {
      const userId = req.user.id;
      const allCats = await Category.find([
        { $match: { user: userId } },
        { $project: { name: 1, catAmount: 1, catRemaining: 1 } }
      ]);
      return allCats;
    })
  )
  .get('/category/:cid', asyncIt(async (req, res, next) => {
    const { cid } = req.params;
    const catById = await Category.findById({ _id: cid });
    return catById;
  }))
  .patch('/category/:cid', jsonParser, asyncIt(async (req, res, next) => {
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
      return saveSubcat;
    }
    return null;
  }))
  .patch(
    '/category/:cid/subcategory/:sid',
    jsonParser, asyncIt
    (async (req, res, next) => {
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
      return updatedSubcat;
    }
  ))
  .delete('/category/:id', asyncIt(async (req, res, next) => {
    const { id } = req.params;
    const deleted = await Category.deleteOne({ _id: id });
    return deleted;
  }))
  .use(jsonParser);

module.exports = router;
