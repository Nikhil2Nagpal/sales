import { useState, useEffect } from 'react';
import { analyticsAPI, uploadAPI } from '../services/api';

export const useAnalytics = () => {
  const [reports, setReports] = useState([]);
  const [currentReport, setCurrentReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch all reports
  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await analyticsAPI.getAllReports();
      setReports(response.data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  // Generate a new report
  const generateReport = async (startDate, endDate) => {
    try {
      setLoading(true);
      // Ensure dates are in proper format
      const start = typeof startDate === 'string' ? startDate : startDate.toISOString();
      const end = typeof endDate === 'string' ? endDate : endDate.toISOString();
      
      const response = await analyticsAPI.generateReport(start, end);
      setCurrentReport(response.data);
      // Add to reports list
      setReports(prev => [response.data, ...prev]);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to generate report');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Upload CSV file with progress tracking
  const uploadCSV = async (file, onProgress) => {
    try {
      setLoading(true);
      setError(null);
      setUploadProgress(0);
      
      const response = await uploadAPI.uploadCSV(file, (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
          if (onProgress) {
            onProgress(percentCompleted);
          }
        }
      });
      
      // Reset progress after successful upload
      setUploadProgress(0);
      
      // Refresh reports after successful upload
      await fetchReports();
      
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to upload CSV file');
      setUploadProgress(0);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return {
    reports,
    currentReport,
    loading,
    error,
    uploadProgress,
    generateReport,
    fetchReports,
    uploadCSV
  };
};