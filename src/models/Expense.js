const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expenseSchema = new Schema({
  timestamp: { type: Date, required: true, default: Date.now },
  category: { type: mongoose.Schema.ObjectId, required: true },
  catName: { type: String, required: true },
  subCategory: { type: mongoose.Schema.ObjectId, required: true },
  subCatName: { type: String, required: true },
  amount: { type: Number, required: true }
});

module.exports = mongoose.model('Expense', expenseSchema);
