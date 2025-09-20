const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/.env' });

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
    
    // Check how much data we have
    const customerCount = await Customer.countDocuments();
    const productCount = await Product.countDocuments();
    const saleCount = await Sale.countDocuments();
    
    console.log(`Database contains: ${customerCount} customers, ${productCount} products, ${saleCount} sales`);
    
    // Get some sample data to understand the date range
    const sampleSales = await Sale.find().sort({ reportDate: -1 }).limit(5);
    console.log('Most recent sales dates:');
    sampleSales.forEach(sale => {
      console.log(`  ${sale.reportDate.toISOString()}`);
    });
    
    // Test with a broad date range to ensure we get data
    const startDate = new Date('2000-01-01');
    const endDate = new Date('2030-12-31');
    
    console.log(`\nTesting analytics with date range: ${startDate.toISOString()} to ${endDate.toISOString()}`);
    
    // Test revenue aggregation
    const revenueData = await aggregateRevenue(startDate, endDate);
    console.log('Revenue data:', revenueData);
    
    // Test top products
    const topProducts = await getTopProducts(startDate, endDate, 5);
    console.log('Top products:', topProducts);
    
    // Test top customers
    const topCustomers = await getTopCustomers(startDate, endDate, 5);
    console.log('Top customers:', topCustomers);
    
    console.log('\nAnalytics test completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Analytics test failed:', error);
    process.exit(1);
  }
};

testAnalytics();