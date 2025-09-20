const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/.env' });

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

// Test the date fix
const testDateFix = async () => {
  try {
    await connectDB();
    
    console.log('Testing date fix...');
    
    // Test with ISO string dates (as sent by the frontend)
    const startDate = '2023-01-01T00:00:00.000Z';
    const endDate = '2025-12-31T23:59:59.999Z';
    
    console.log(`Testing with ISO dates: ${startDate} to ${endDate}`);
    
    // Test revenue aggregation
    const revenueData = await aggregateRevenue(startDate, endDate);
    console.log('Revenue data:', revenueData);
    
    // Test top products
    const topProducts = await getTopProducts(startDate, endDate, 5);
    console.log('Top products count:', topProducts.length);
    
    // Test top customers
    const topCustomers = await getTopCustomers(startDate, endDate, 5);
    console.log('Top customers count:', topCustomers.length);
    
    console.log('Date fix test completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Date fix test failed:', error);
    process.exit(1);
  }
};

testDateFix();