const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/.env' });

const Customer = require('./models/Customer');
const Product = require('./models/Product');
const Sale = require('./models/Sale');

// MongoDB connection with improved error handling
const connectDB = async () => {
  try {
    console.log('MONGODB_URI:', process.env.MONGODB_URI);
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

// Add default sample data
const addDefaultSampleData = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await Customer.deleteMany({});
    await Product.deleteMany({});
    await Sale.deleteMany({});
    
    console.log('Cleared existing data');
    
    // Create sample customers
    const customers = [
      { name: 'Tech Solutions Inc.', region: 'North America', type: 'Business' },
      { name: 'Global Enterprises', region: 'Europe', type: 'Business' },
      { name: 'Digital Innovations Ltd', region: 'Asia Pacific', type: 'Business' },
      { name: 'Future Tech Corp', region: 'North America', type: 'Business' },
      { name: 'Smart Devices Co', region: 'Europe', type: 'Business' },
    ];
    
    const createdCustomers = await Customer.insertMany(customers);
    console.log('Created customers:', createdCustomers.length);
    
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
    console.log('Created products:', createdProducts.length);
    
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
    console.log('Created sales:', createdSales.length);
    
    console.log('Default sample data added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error adding default sample data:', error);
    process.exit(1);
  }
};

addDefaultSampleData();