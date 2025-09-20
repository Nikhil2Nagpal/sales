const axios = require('axios');

// Test the analytics API endpoint directly
const testApiEndpoint = async () => {
  try {
    console.log('Testing analytics API endpoint...');
    
    // Use a broad date range to ensure we get data
    const startDate = '2000-01-01T00:00:00.000Z';
    const endDate = '2030-12-31T23:59:59.999Z';
    
    console.log(`Testing with date range: ${startDate} to ${endDate}`);
    
    const response = await axios.get(`http://localhost:5000/api/analytics/report?startDate=${startDate}&endDate=${endDate}`);
    
    console.log('API Response Status:', response.status);
    console.log('API Response Data:', JSON.stringify(response.data, null, 2));
    
    console.log('Test completed successfully');
  } catch (error) {
    console.error('API Test failed:', error.response?.data || error.message);
  }
};

testApiEndpoint();