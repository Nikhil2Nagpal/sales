import axios from 'axios';

// ✅ Use environment variable (recommended) — no hardcoded URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ✅ Create base axios instance with /api prefix built-in
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`, // ← /api automatically added to all requests
});

// ✅ Analytics API calls
export const analyticsAPI = {
  // Generate a new report
  generateReport: (startDate, endDate) => {
    const params = new URLSearchParams({
      startDate: typeof startDate === 'string' ? startDate : startDate.toISOString(),
      endDate: typeof endDate === 'string' ? endDate : endDate.toISOString()
    });
    
    return api.get(`/analytics/report?${params.toString()}`); // ← now /api/analytics/report
  },
  
  // Get all reports
  getAllReports: () => {
    return api.get('/analytics/reports'); // ← /api already in baseURL
  },
};

// ✅ Upload API calls — now using same `api` instance for consistency
export const uploadAPI = {
  uploadCSV: (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post('/upload/csv', formData, { // ← /api/upload/csv
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 0,
      onUploadProgress,
    });
  },
};

export default api;