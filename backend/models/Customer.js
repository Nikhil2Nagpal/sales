const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: String,
  region: String,
  type: String, // e.g., 'Individual', 'Business'
});

module.exports = mongoose.model('Customer', customerSchema);