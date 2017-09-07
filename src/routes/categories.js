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
  .get('/category/:cid', async (req, res, next) => {
    console.log('get cat by id: ',req.params);
    const {cid} = req.params
    const catById = await Category.findById({ _id: cid });
    res.send(catById);
  })
  .patch('/category/:cid', jsonParser, async (req, res, next) => {
    console.log('HELLO PATCH CATEGORY!: ', req.body)

  })
  .patch('/category/:cid/subcategory/:sid', jsonParser, async (req, res, next) => {
    // const { query, update } = req.body;
    console.log('HELLO PATCH!: ', req.body)
    // const update = {};
    // if(body.subName) { update[subCategories.$.subCatName] : body.subName };
    // if(body.subAmount) { update[subCategories.$.subCatAmount]: body.subAmount };

    // const newSubcat = await Category.update({_id:cid, subCategory._id:sid }, {$set:{update}}, {new: true, runValidators: true});

  })
  .delete('/category/:id', async (req, res, next) => {})
  .use(jsonParser);

module.exports = router;
