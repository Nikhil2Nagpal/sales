const mongoose = require('mongoose');
const Customer = require('./models/Customer');
const Product = require('./models/Product');
const Sale = require('./models/Sale');
require('dotenv').config();

// MongoDB connection with improved error handling
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Remove deprecated options
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// Connect to MongoDB
connectDB().then(async () => {
  console.log('Connected to MongoDB');
  
  try {
    // Clear existing data
    await Customer.deleteMany({});
    await Product.deleteMany({});
    await Sale.deleteMany({});
    
    console.log('Cleared existing data');
    
    // Create sample customers
    const customers = [
      { name: 'John Doe', region: 'North', type: 'Individual' },
      { name: 'Jane Smith', region: 'South', type: 'Business' },
      { name: 'Bob Johnson', region: 'East', type: 'Individual' },
      { name: 'Alice Brown', region: 'West', type: 'Business' },
      { name: 'Charlie Wilson', region: 'North', type: 'Business' },
      { name: 'Diana Davis', region: 'South', type: 'Individual' },
      { name: 'Eve Miller', region: 'East', type: 'Business' },
      { name: 'Frank Garcia', region: 'West', type: 'Individual' },
    ];
    
    const createdCustomers = await Customer.insertMany(customers);
    console.log('Created customers:', createdCustomers.length);
    
    // Create sample products
    const products = [
      { name: 'Laptop', category: 'Electronics', price: 1200 },
      { name: 'Smartphone', category: 'Electronics', price: 800 },
      { name: 'Desk Chair', category: 'Furniture', price: 150 },
      { name: 'Monitor', category: 'Electronics', price: 300 },
      { name: 'Coffee Table', category: 'Furniture', price: 200 },
      { name: 'Headphones', category: 'Electronics', price: 100 },
      { name: 'Bookshelf', category: 'Furniture', price: 250 },
      { name: 'Tablet', category: 'Electronics', price: 500 },
    ];
    
    const createdProducts = await Product.insertMany(products);
    console.log('Created products:', createdProducts.length);
    
    // Create sample sales data spanning 2 years
    const sales = [];
    const startDate = new Date('2023-01-01');
    const endDate = new Date('2025-09-20');
    
    // Generate 100+ sales records
    for (let i = 0; i < 150; i++) {
      const randomCustomer = createdCustomers[Math.floor(Math.random() * createdCustomers.length)];
      const randomProduct = createdProducts[Math.floor(Math.random() * createdProducts.length)];
      const quantity = Math.floor(Math.random() * 10) + 1;
      const totalRevenue = quantity * randomProduct.price;
      
      // Generate random date between startDate and endDate
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
    
    console.log('Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
});