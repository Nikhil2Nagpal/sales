const mongoose = require('mongoose');

const analyticsReportSchema = new mongoose.Schema({
  reportDate: Date,
  startDate: Date,
  endDate: Date,
  totalRevenue: Number,
  avgOrderValue: Number,
  topProducts: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    totalSales: Number,
  }],
  topCustomers: [{
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    totalSpent: Number,
  }],
  regionStats: [{
    region: String,
    totalRevenue: Number,
  }],
  categoryStats: [{
    category: String,
    totalRevenue: Number,
  }],
});

module.exports = mongoose.model('AnalyticsReport', analyticsReportSchema);