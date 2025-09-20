const Customer = require('../models/Customer');
const Product = require('../models/Product');
const Sale = require('../models/Sale');
const AnalyticsReport = require('../models/AnalyticsReport');

// Helper function to properly parse dates
const parseDate = (dateString) => {
  // If it's already a Date object, return it
  if (dateString instanceof Date) {
    return dateString;
  }
  
  // If it's a string, try to parse it properly
  if (typeof dateString === 'string') {
    // Handle different date formats
    if (dateString.includes('T')) {
      // ISO format
      return new Date(dateString);
    }
    
    // Handle MM/DD/YYYY format (from your CSV)
    if (dateString.match(/^\d{1,2}\/\d{1,2}\/\d{4}/)) {
      const parts = dateString.split(' ')[0].split('/');
      const month = parseInt(parts[0]) - 1; // Month is 0-indexed
      const day = parseInt(parts[1]);
      const year = parseInt(parts[2]);
      return new Date(year, month, day);
    }
    
    // If it's in YYYY-MM-DD format, create a date at the start of that day
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return new Date(dateString + 'T00:00:00.000Z');
    }
  }
  
  // Fallback to default Date parsing
  return new Date(dateString);
};

// Aggregate revenue by date range
const aggregateRevenue = async (startDate, endDate) => {
  try {
    const start = parseDate(startDate);
    const end = parseDate(endDate);
    
    const result = await Sale.aggregate([
      { 
        $match: { 
          reportDate: { 
            $gte: start, 
            $lte: end 
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
    
    return result.length > 0 ? result[0] : { totalRevenue: 0 };
  } catch (error) {
    throw new Error('Error aggregating revenue: ' + error.message);
  }
};

// Get top selling products
const getTopProducts = async (startDate, endDate, limit = 5) => {
  try {
    const start = parseDate(startDate);
    const end = parseDate(endDate);
    
    const result = await Sale.aggregate([
      { 
        $match: { 
          reportDate: { 
            $gte: start, 
            $lte: end 
          } 
        } 
      },
      { 
        $group: { 
          _id: '$productId', 
          totalSales: { $sum: '$quantity' } 
        } 
      },
      { 
        $sort: { totalSales: -1 } 
      },
      { 
        $limit: limit 
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      {
        $unwind: '$productInfo'
      },
      {
        $project: {
          productId: '$_id',
          productName: '$productInfo.name',
          totalSales: 1,
          _id: 0
        }
      }
    ]);
    
    return result;
  } catch (error) {
    throw new Error('Error getting top products: ' + error.message);
  }
};

// Get top customers
const getTopCustomers = async (startDate, endDate, limit = 5) => {
  try {
    const start = parseDate(startDate);
    const end = parseDate(endDate);
    
    const result = await Sale.aggregate([
      { 
        $match: { 
          reportDate: { 
            $gte: start, 
            $lte: end 
          } 
        } 
      },
      { 
        $group: { 
          _id: '$customerId', 
          totalSpent: { $sum: '$totalRevenue' } 
        } 
      },
      { 
        $sort: { totalSpent: -1 } 
      },
      { 
        $limit: limit 
      },
      {
        $lookup: {
          from: 'customers',
          localField: '_id',
          foreignField: '_id',
          as: 'customerInfo'
        }
      },
      {
        $unwind: '$customerInfo'
      },
      {
        $project: {
          customerId: '$_id',
          customerName: '$customerInfo.name',
          totalSpent: 1,
          _id: 0
        }
      }
    ]);
    
    return result;
  } catch (error) {
    throw new Error('Error getting top customers: ' + error.message);
  }
};

// Generate analytics report
const generateReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate are required' });
    }
    
    // Get aggregated data
    const revenueData = await aggregateRevenue(startDate, endDate);
    const topProducts = await getTopProducts(startDate, endDate);
    const topCustomers = await getTopCustomers(startDate, endDate);
    
    // Calculate average order value
    const start = parseDate(startDate);
    const end = parseDate(endDate);
    
    const totalOrders = await Sale.countDocuments({
      reportDate: { 
        $gte: start, 
        $lte: end 
      }
    });
    
    const avgOrderValue = totalOrders > 0 ? revenueData.totalRevenue / totalOrders : 0;
    
    // Create report object
    const report = {
      reportDate: new Date(),
      startDate: start,
      endDate: end,
      totalRevenue: revenueData.totalRevenue,
      avgOrderValue: avgOrderValue,
      topProducts: topProducts,
      topCustomers: topCustomers
    };
    
    // Save report to database
    const savedReport = await AnalyticsReport.create(report);
    
    res.json(savedReport);
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

// Get all reports
const getAllReports = async (req, res) => {
  try {
    const reports = await AnalyticsReport.find().sort({ reportDate: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

module.exports = {
  aggregateRevenue,
  getTopProducts,
  getTopCustomers,
  generateReport,
  getAllReports
};