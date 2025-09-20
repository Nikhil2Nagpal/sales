const axios = require('axios');

// Test the analytics API
const testAnalyticsAPI = async () => {
  try {
    console.log('Testing analytics API...');
    
    // Use a date range that should include data
    const startDate = '2023-01-01';
    const endDate = '2025-12-31';
    
    console.log(`Testing with date range: ${startDate} to ${endDate}`);
    
    const response = await axios.get(`http://localhost:5000/api/analytics/report?startDate=${startDate}&endDate=${endDate}`);
    
    console.log('API Response:', response.data);
    
    console.log('Test completed successfully');
  } catch (error) {
    console.error('API Test failed:', error.response?.data || error.message);
  }
};

testAnalyticsAPI();