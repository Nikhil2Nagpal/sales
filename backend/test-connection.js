const mongoose = require('mongoose');
require('dotenv').config();

// Test MongoDB connection
const testConnection = async () => {
  try {
    console.log('Testing MongoDB connection...');
    console.log('Using URI:', process.env.MONGODB_URI.replace(/\/\/(.*):(.*)@/, '//****:****@')); // Hide credentials
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Remove deprecated options
    });
    
    console.log('✅ MongoDB Connection Successful!');
    console.log('Connected to:', conn.connection.name);
    console.log('Host:', conn.connection.host);
    console.log('Port:', conn.connection.port);
    
    // Test basic operations
    console.log('\nTesting basic operations...');
    
    // Create a simple test model
    const TestSchema = new mongoose.Schema({
      name: String,
      createdAt: { type: Date, default: Date.now }
    });
    
    const TestModel = mongoose.model('ConnectionTest', TestSchema);
    
    // Create a test document
    const testDoc = new TestModel({ name: 'Connection Test' });
    await testDoc.save();
    console.log('✅ Create operation successful');
    
    // Read the test document
    const foundDoc = await TestModel.findOne({ name: 'Connection Test' });
    console.log('✅ Read operation successful');
    
    // Delete the test document
    await TestModel.deleteOne({ name: 'Connection Test' });
    console.log('✅ Delete operation successful');
    
    console.log('\n🎉 All tests passed! MongoDB is ready for use.');
    
    // Close connection
    await mongoose.connection.close();
    console.log('Connection closed.');
    
  } catch (error) {
    console.error('❌ MongoDB Connection Failed!');
    console.error('Error:', error.message);
    
    // Provide specific troubleshooting tips
    if (error.message.includes('authentication failed')) {
      console.log('\n🔧 Troubleshooting tip:');
      console.log('- Check your MongoDB username and password');
      console.log('- Ensure your user has proper database access');
      console.log('- Verify your IP address is whitelisted in MongoDB Atlas');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      console.log('\n🔧 Troubleshooting tip:');
      console.log('- Check if MongoDB is running');
      console.log('- Verify your MongoDB URI is correct');
      console.log('- Ensure network connectivity to MongoDB');
    }
    
    process.exit(1);
  }
};

testConnection();