import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create base axios instance without default Content-Type
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Analytics API calls
export const analyticsAPI = {
  // Generate a new report
  generateReport: (startDate, endDate) => {
    // Properly encode the dates as query parameters
    const params = new URLSearchParams({
      startDate: typeof startDate === 'string' ? startDate : startDate.toISOString(),
      endDate: typeof endDate === 'string' ? endDate : endDate.toISOString()
    });
    
    return api.get(`/analytics/report?${params.toString()}`);
  },
  
  // Get all reports
  getAllReports: () => {
    return api.get('/analytics/reports');
  },
};

// Upload API calls
export const uploadAPI = {
  // Upload CSV file with progress tracking
  uploadCSV: (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return axios.post(`${API_BASE_URL}/upload/csv`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 0, // No timeout for large files
      onUploadProgress: onUploadProgress,
    });
  },
};

export default api;