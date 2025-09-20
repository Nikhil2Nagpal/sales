const mongoose = require('mongoose');
require('dotenv').config();

const Customer = require('./models/Customer');
const Product = require('./models/Product');
const Sale = require('./models/Sale');
const { aggregateRevenue, getTopProducts, getTopCustomers } = require('./controllers/analyticsController');

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

// Test analytics functions
const testAnalytics = async () => {
  try {
    await connectDB();
    
    console.log('Testing analytics functions...');
    
    // Test with a date range that should include data
    const startDate = new Date('2023-01-01');
    const endDate = new Date('2025-12-31');
    
    console.log(`Testing with date range: ${startDate.toISOString()} to ${endDate.toISOString()}`);
    
    // Test revenue aggregation
    const revenueData = await aggregateRevenue(startDate, endDate);
    console.log('Revenue data:', revenueData);
    
    // Test top products
    const topProducts = await getTopProducts(startDate, endDate, 5);
    console.log('Top products:', topProducts);
    
    // Test top customers
    const topCustomers = await getTopCustomers(startDate, endDate, 5);
    console.log('Top customers:', topCustomers);
    
    // Test total orders count
    const totalOrders = await Sale.countDocuments({
      reportDate: { 
        $gte: startDate, 
        $lte: endDate 
      }
    });
    console.log('Total orders:', totalOrders);
    
    console.log('Analytics test completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Analytics test failed:', error);
    process.exit(1);
  }
};

testAnalytics();