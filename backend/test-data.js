const mongoose = require('mongoose');
require('dotenv').config();

const Customer = require('./models/Customer');
const Product = require('./models/Product');
const Sale = require('./models/Sale');

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// Test data retrieval
const testDataRetrieval = async () => {
  try {
    await connectDB();
    
    console.log('Testing data retrieval...');
    
    // Count documents
    const customerCount = await Customer.countDocuments();
    const productCount = await Product.countDocuments();
    const saleCount = await Sale.countDocuments();
    
    console.log(`Customers: ${customerCount}`);
    console.log(`Products: ${productCount}`);
    console.log(`Sales: ${saleCount}`);
    
    // Get sample data
    if (customerCount > 0) {
      const sampleCustomers = await Customer.find().limit(5);
      console.log('Sample customers:', sampleCustomers);
    }
    
    if (productCount > 0) {
      const sampleProducts = await Product.find().limit(5);
      console.log('Sample products:', sampleProducts);
    }
    
    if (saleCount > 0) {
      const sampleSales = await Sale.find().limit(5).populate('customerId productId');
      console.log('Sample sales:', sampleSales);
    }
    
    console.log('Test completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
};

testDataRetrieval();