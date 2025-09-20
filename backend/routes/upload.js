const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const Sale = require('../models/Sale');

// Configure multer for file upload with streaming
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  },
  limits: {
    fileSize: 100 * 1024 * 1024 // Increased to 100MB limit
  }
});

// Add default sample data to ensure there's always some data to display
const addDefaultSampleData = async () => {
  try {
    // Check if we already have data
    const customerCount = await Customer.countDocuments();
    const productCount = await Product.countDocuments();
    const saleCount = await Sale.countDocuments();
    
    // If there's no data, add some default sample data
    if (customerCount === 0 && productCount === 0 && saleCount === 0) {
      console.log('Adding default sample data...');
      
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
      console.log(`Added default sample data: ${createdCustomers.length} customers, ${createdProducts.length} products, ${createdSales.length} sales`);
    }
  } catch (error) {
    console.error('Error adding default sample data:', error);
  }
};

// Process CSV data with improved streaming and batch processing
const processCSVData = async (filePath, res) => {
  return new Promise((resolve, reject) => {
    let processedCount = 0;
    let totalRows = 0;
    let batch = [];
    const batchSize = 50; // Reduced batch size for better memory management
    let isProcessing = false;
    
    console.log('Starting CSV processing for file:', filePath);
    
    const stream = fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', async (data) => {
        totalRows++;
        batch.push(data);
        
        // Process in batches to avoid memory issues
        if (batch.length >= batchSize && !isProcessing) {
          stream.pause(); // Pause the stream while processing
          isProcessing = true;
          
          try {
            await processBatch(batch);
            processedCount += batch.length;
            batch = []; // Clear the batch
            
            // Send progress update
            if (res && res.socket) {
              console.log(`Processed ${processedCount} rows so far...`);
            }
            
            isProcessing = false;
            stream.resume(); // Resume the stream
          } catch (error) {
            stream.destroy();
            isProcessing = false;
            reject(error);
          }
        }
      })
      .on('end', async () => {
        // Process remaining batch
        if (batch.length > 0 && !isProcessing) {
          try {
            await processBatch(batch);
            processedCount += batch.length;
            console.log(`Finished processing. Total rows: ${totalRows}, Processed: ${processedCount}`);
          } catch (error) {
            return reject(error);
          }
        }
        
        // Delete the uploaded file after processing
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        
        resolve({ processedRows: processedCount, totalRows });
      })
      .on('error', (error) => {
        // Delete the uploaded file in case of error
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        reject(error);
      });
  });
};

// Process a batch of rows with improved error handling and column mapping
const processBatch = async (batch) => {
  // Process each row in the batch sequentially to avoid database connection issues
  for (const row of batch) {
    try {
      // Map column names from your CSV format to expected format
      const customerName = row.customerName || row.CUSTOMERNAME || 'Unknown Customer';
      const productName = row.productName || row.PRODUCTLINE || row.PRODUCTCODE || 'Unknown Product';
      const price = parseFloat(row.price || row.PRICEEACH || 0);
      const quantity = parseInt(row.quantity || row.QUANTITYORDERED || 1);
      const totalRevenue = parseFloat(row.totalRevenue || row.SALES || (price * quantity));
      const date = row.date || row.ORDERDATE || new Date();
      
      // Create or find customer
      let customer = await Customer.findOne({ name: customerName });
      if (!customer) {
        customer = new Customer({
          name: customerName,
          region: row.customerRegion || row.COUNTRY || row.TERRITORY || 'Global',
          type: row.customerType || 'Business' // Default to Business since we don't have this info
        });
        await customer.save();
      }
      
      // Create or find product
      let product = await Product.findOne({ name: productName });
      if (!product) {
        product = new Product({
          name: productName,
          category: row.productCategory || row.PRODUCTLINE || 'General',
          price: price
        });
        await product.save();
      }
      
      // Create sale record
      const sale = new Sale({
        customerId: customer._id,
        productId: product._id,
        quantity: quantity,
        totalRevenue: totalRevenue,
        reportDate: new Date(date)
      });
      
      await sale.save();
    } catch (error) {
      console.error('Error processing row:', error);
      // Skip this row but continue processing
      continue;
    }
  }
};

// Upload CSV endpoint with improved processing
router.post('/csv', upload.single('file'), async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded. Please select a CSV file.' });
    }
    
    console.log('Received file for processing:', req.file.originalname);
    console.log('File size:', req.file.size, 'bytes');
    console.log('File path:', req.file.path);
    
    // Process the CSV file
    const result = await processCSVData(req.file.path, res);
    
    // Check if headers have already been sent
    if (res.headersSent) {
      console.log('Headers already sent, skipping JSON response');
      return;
    }
    
    // Add default sample data if this is the first upload
    await addDefaultSampleData();
    
    // Send JSON response
    res.json({ 
      message: `CSV file processed successfully. Processed ${result.processedRows} out of ${result.totalRows} rows.`, 
      processedRows: result.processedRows,
      totalRows: result.totalRows
    });
  } catch (error) {
    console.error('Error processing CSV file:', error);
    
    // Check if headers have already been sent
    if (res.headersSent) {
      console.log('Headers already sent, skipping error response');
      return;
    }
    
    res.status(500).json({ error: 'Error processing CSV file: ' + error.message });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File is too large. Maximum file size is 100MB.' });
    }
  }
  
  if (error.message === 'Only CSV files are allowed') {
    return res.status(400).json({ error: 'Invalid file type. Only CSV files are allowed.' });
  }
  
  console.error('Upload error:', error);
  res.status(500).json({ error: error.message || 'An error occurred during file upload.' });
});

module.exports = router;