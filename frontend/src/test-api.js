// Simple test to check if frontend can access the API
export const testApiConnection = async () => {
  try {
    console.log('Testing API connection from frontend...');
    
    // Use a broad date range to ensure we get data
    const startDate = '2000-01-01T00:00:00.000Z';
    const endDate = '2030-12-31T23:59:59.999Z';
    
    const response = await fetch(`http://localhost:5000/api/analytics/report?startDate=${startDate}&endDate=${endDate}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API Response:', data);
    return data;
  } catch (error) {
    console.error('API Connection Test failed:', error);
    throw error;
  }
};