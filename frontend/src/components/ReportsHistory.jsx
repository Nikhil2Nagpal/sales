import React from 'react';
import { formatCurrency, formatDate } from '../utils/format';

const ReportsHistory = ({ reports, onReportSelect }) => {
  if (!reports || reports.length === 0) {
    return <div className="reports-history">No reports available</div>;
  }

  return (
    <div className="reports-history">
      <h2>Reports History</h2>
      <table>
        <thead>
          <tr>
            <th>Report Date</th>
            <th>Date Range</th>
            <th>Total Revenue</th>
            <th>Avg Order Value</th>
          </tr>
        </thead>
        <tbody>
          {reports.map(report => (
            <tr 
              key={report._id} 
              onClick={() => onReportSelect(report)}
              className="report-row"
            >
              <td>{formatDate(report.reportDate)}</td>
              <td>
                {formatDate(report.startDate)} - 
                {formatDate(report.endDate)}
              </td>
              <td>{formatCurrency(report.totalRevenue || 0)}</td>
              <td>{formatCurrency(report.avgOrderValue || 0)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportsHistory;