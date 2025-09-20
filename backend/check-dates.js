const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/.env' });

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

// Check date ranges in the database
const checkDateRanges = async () => {
  try {
    await connectDB();
    
    console.log('Checking date ranges in sales data...');
    
    // Get the earliest and latest dates
    const earliestDate = await Sale.findOne().sort({ reportDate: 1 });
    const latestDate = await Sale.findOne().sort({ reportDate: -1 });
    
    console.log('Earliest date:', earliestDate?.reportDate);
    console.log('Latest date:', latestDate?.reportDate);
    
    // Get a sample of dates
    const sampleDates = await Sale.find({}, { reportDate: 1 }).limit(10);
    console.log('Sample dates:', sampleDates.map(s => s.reportDate));
    
    console.log('Date check completed');
    process.exit(0);
  } catch (error) {
    console.error('Date check failed:', error);
    process.exit(1);
  }
};

checkDateRanges();