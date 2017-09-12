const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subCategorySchema = new Schema({
  subName: { type: String, required: true },
  subCatAmount: { type: Number, required: true },
  subCatRemaining: { type: Number, required: false }
});

const categorySchema = new Schema({
  timestamp: { type: Date, required: true, default: Date.now },
  name: { type: String, required: true, ref: 'User' },
  catAmount: { type: Number, required: true },
  catRemaining: { type: Number, required: true },
  user: {type:mongoose.Schema.Types.ObjectId, required: true},
  subCategories: [subCategorySchema]
});

module.exports = mongoose.model('Category', categorySchema);
