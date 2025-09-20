import React from 'react';
import { formatCurrency } from '../utils/format';

const KeyMetrics = ({ report }) => {
  if (!report) {
    return <div className="key-metrics">No data available</div>;
  }

  return (
    <div className="key-metrics">
      <h2>Key Metrics</h2>
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Total Revenue</h3>
          <p className="metric-value">{formatCurrency(report.totalRevenue || 0)}</p>
        </div>
        
        <div className="metric-card">
          <h3>Average Order Value</h3>
          <p className="metric-value">{formatCurrency(report.avgOrderValue || 0)}</p>
        </div>
        
        <div className="metric-card">
          <h3>Top Product</h3>
          <p className="metric-value">
            {report.topProducts?.length > 0 ? report.topProducts[0].productName : 'N/A'}
          </p>
        </div>
        
        <div className="metric-card">
          <h3>Top Customer</h3>
          <p className="metric-value">
            {report.topCustomers?.length > 0 ? report.topCustomers[0].customerName : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default KeyMetrics;