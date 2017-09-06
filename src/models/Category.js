const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subCategorySchema = new Schema({
  subName: { type: String, required: true },
  subCatAmount: { type: Number, required: true },
  subCatRemaining: { type: Number, required: true }
});

const categorySchema = new Schema({
  timestamp: { type: Date, required: true, default: Date.now },
  name: { type: String, required: true },
  catAmount: { type: Number, required: true },
  catRemaining: { type: Number, required: true },
  subCategories: [subCategorySchema]
});

module.exports = mongoose.model('Category', categorySchema);
