import React, { useState } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import DateRangePicker from '../components/DateRangePicker';
import KeyMetrics from '../components/KeyMetrics';
import Charts from '../components/Charts';
import ReportsHistory from '../components/ReportsHistory';

const Dashboard = () => {
  const { 
    reports, 
    currentReport, 
    loading, 
    error, 
    uploadProgress,
    generateReport,
    uploadCSV
  } = useAnalytics();
  
  const [selectedReport, setSelectedReport] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleDateRangeChange = async (startDate, endDate) => {
    try {
      // Ensure dates are in proper ISO format
      const start = typeof startDate === 'string' ? startDate : startDate.toISOString();
      const end = typeof endDate === 'string' ? endDate : endDate.toISOString();
      
      await generateReport(start, end);
    } catch (err) {
      console.error('Failed to generate report:', err);
    }
  };

  const handleReportSelect = (report) => {
    setSelectedReport(report);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setUploadStatus('Please upload a CSV file');
      setTimeout(() => {
        setUploadStatus('');
      }, 3000);
      return;
    }

    setIsUploading(true);
    setUploadStatus('Uploading file...');

    try {
      // Upload the file to the backend with progress tracking
      const response = await uploadCSV(file, (progress) => {
        setUploadStatus(`Uploading: ${progress}% complete`);
      });
      
      setUploadStatus('Processing data... This may take a moment.');
      
      // Small delay to show processing message
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUploadStatus('File processed successfully! New data is now available.');
      
      // Reset after 3 seconds
      setTimeout(() => {
        setUploadStatus('');
        setIsUploading(false);
      }, 3000);
    } catch (err) {
      console.error('Upload error:', err);
      setUploadStatus('Upload failed: ' + (err.response?.data?.error || err.message || 'Unknown error'));
      setIsUploading(false);
      
      // Clear error message after 5 seconds
      setTimeout(() => {
        setUploadStatus('');
      }, 5000);
    }
  };

  const displayReport = selectedReport || currentReport;

  return (
    <div className="dashboard">
      <header>
        <h1>Sales Analytics Dashboard</h1>
        <p>Comprehensive sales insights with date-range filtering, interactive visualizations, and CSV data import</p>
      </header>
      
      <main>
        {/* CSV Upload Section */}
        <div className="file-upload-section">
          <h2>Import Sales Data</h2>
          <div 
            className={`upload-area ${isUploading ? 'active' : ''}`}
            onClick={() => !isUploading && document.getElementById('fileInput').click()}
          >
            <i>📁</i>
            <h3>Upload CSV File</h3>
            <p>Drag & drop your sales data file here or click to browse</p>
            <button className="upload-btn" disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Select CSV File'}
            </button>
            <input
              type="file"
              id="fileInput"
              className="file-input"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </div>
          
          {uploadStatus && (
            <div className="upload-status">
              <p>{uploadStatus}</p>
              {uploadProgress > 0 && (
                <div className="upload-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p>{uploadProgress}%</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="controls">
          <DateRangePicker onDateRangeChange={handleDateRangeChange} />
        </div>
        
        {error && (
          <div className="error-message">
            ❌ Error: {error}
          </div>
        )}
        
        {loading && (
          <div className="loading">
            🔄 Loading analytics data...
          </div>
        )}
        
        {displayReport && (
          <>
            <KeyMetrics report={displayReport} />
            <Charts report={displayReport} />
          </>
        )}
        
        <ReportsHistory 
          reports={reports} 
          onReportSelect={handleReportSelect} 
        />
      </main>
    </div>
  );
};

export default Dashboard;