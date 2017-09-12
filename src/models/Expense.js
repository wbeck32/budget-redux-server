const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = require('mongoose').Types.ObjectId;

const expenseSchema = new Schema({
  timestamp: { type: Date, required: true, default: Date.now },
  category: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Category' },
  catName: { type: String, required: true },
  subCategory: { type: mongoose.Schema.Types.ObjectId, required: true },
  subCatName: { type: String, required: true },
  amount: { type: Number, required: true }
});

module.exports = mongoose.model('Expense', expenseSchema);
