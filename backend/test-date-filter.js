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

// Test date filtering
const testDateFiltering = async () => {
  try {
    await connectDB();
    
    console.log('Testing date filtering...');
    
    // Test with a date range that should include data
    const startDate = new Date('2023-01-01');
    const endDate = new Date('2025-12-31');
    
    console.log(`Testing with date range: ${startDate.toISOString()} to ${endDate.toISOString()}`);
    
    // Test the same query used in the analytics controller
    const result = await Sale.aggregate([
      { 
        $match: { 
          reportDate: { 
            $gte: startDate, 
            $lte: endDate 
          } 
        } 
      },
      { 
        $group: { 
          _id: null, 
          totalRevenue: { $sum: '$totalRevenue' } 
        } 
      },
      { 
        $project: { 
          _id: 0, 
          totalRevenue: 1 
        } 
      }
    ]);
    
    console.log('Aggregation result:', result);
    
    // Also test with a simple count
    const count = await Sale.countDocuments({
      reportDate: { 
        $gte: startDate, 
        $lte: endDate 
      }
    });
    
    console.log('Count result:', count);
    
    console.log('Date filtering test completed');
    process.exit(0);
  } catch (error) {
    console.error('Date filtering test failed:', error);
    process.exit(1);
  }
};

testDateFiltering();