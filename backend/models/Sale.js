const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: Number,
  totalRevenue: Number,
  reportDate: Date,
});

module.exports = mongoose.model('Sale', saleSchema);