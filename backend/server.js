const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: __dirname + '/.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// Increase payload limits for large file uploads
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection with improved error handling
const connectDB = async () => {
  try {
    console.log('MONGODB_URI:', process.env.MONGODB_URI);
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Remove deprecated options
      serverSelectionTimeoutMS: 60000, // Increase server selection timeout
      socketTimeoutMS: 120000, // Increase socket timeout
      maxPoolSize: 10, // Limit connection pool size
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// Add default sample data on startup if database is empty
const addDefaultDataOnStartup = async () => {
  try {
    const Customer = require('./models/Customer');
    const Product = require('./models/Product');
    const Sale = require('./models/Sale');
    
    // Check if we already have data
    const customerCount = await Customer.countDocuments();
    const productCount = await Product.countDocuments();
    const saleCount = await Sale.countDocuments();
    
    console.log(`Database contains: ${customerCount} customers, ${productCount} products, ${saleCount} sales`);
    
    // If there's no data, add some default sample data
    if (customerCount === 0 && productCount === 0 && saleCount === 0) {
      console.log('Adding default sample data on startup...');
      
      // Create sample customers
      const customers = [
        { name: 'Tech Solutions Inc.', region: 'North America', type: 'Business' },
        { name: 'Global Enterprises', region: 'Europe', type: 'Business' },
        { name: 'Digital Innovations Ltd', region: 'Asia Pacific', type: 'Business' },
        { name: 'Future Tech Corp', region: 'North America', type: 'Business' },
        { name: 'Smart Devices Co', region: 'Europe', type: 'Business' },
      ];
      
      const createdCustomers = await Customer.insertMany(customers);
      
      // Create sample products
      const products = [
        { name: 'Smartphone X1', category: 'Electronics', price: 899 },
        { name: 'Laptop Pro 15', category: 'Electronics', price: 1499 },
        { name: 'Wireless Headphones', category: 'Audio', price: 199 },
        { name: 'Smart Watch Series 5', category: 'Wearables', price: 349 },
        { name: 'Tablet Ultra', category: 'Electronics', price: 699 },
        { name: 'Gaming Console', category: 'Entertainment', price: 499 },
        { name: 'Bluetooth Speaker', category: 'Audio', price: 129 },
        { name: 'Fitness Tracker', category: 'Wearables', price: 89 },
      ];
      
      const createdProducts = await Product.insertMany(products);
      
      // Create sample sales data for the current year
      const sales = [];
      const currentYear = new Date().getFullYear();
      const startDate = new Date(currentYear, 0, 1); // January 1st
      const endDate = new Date(currentYear, 11, 31); // December 31st
      
      // Generate 20 sample sales records
      for (let i = 0; i < 20; i++) {
        const randomCustomer = createdCustomers[Math.floor(Math.random() * createdCustomers.length)];
        const randomProduct = createdProducts[Math.floor(Math.random() * createdProducts.length)];
        const quantity = Math.floor(Math.random() * 5) + 1; // 1-5 units
        const totalRevenue = quantity * randomProduct.price;
        
        // Generate random date within the year
        const randomDate = new Date(
          startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
        );
        
        sales.push({
          customerId: randomCustomer._id,
          productId: randomProduct._id,
          quantity: quantity,
          totalRevenue: totalRevenue,
          reportDate: randomDate,
        });
      }
      
      const createdSales = await Sale.insertMany(sales);
      console.log(`Added default sample data on startup: ${createdCustomers.length} customers, ${createdProducts.length} products, ${createdSales.length} sales`);
    } else {
      console.log(`Database already contains data: ${customerCount} customers, ${productCount} products, ${saleCount} sales`);
    }
  } catch (error) {
    console.error('Error adding default sample data on startup:', error);
  }
};

// Connect to MongoDB
connectDB().then(async () => {
  // Add default data if database is empty
  await addDefaultDataOnStartup();
});

// Increase server timeout for large file processing
app.use((req, res, next) => {
  // Set server timeout to 10 minutes for upload routes
  if (req.path.includes('/upload')) {
    req.setTimeout(600000); // 10 minutes
    res.setTimeout(600000); // 10 minutes
  }
  next();
});

// Routes
const analyticsRoutes = require('./routes/analytics');
const uploadRoutes = require('./routes/upload');

app.use('/api/analytics', analyticsRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/health', (req, res) => {
  res.json({ message: 'Sales Analytics Dashboard API is running!' });
});

// Serve static assets if in production
/*if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('frontend/dist'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
  });
}*/

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Increase server timeout
server.setTimeout(600000); // 10 minutes
