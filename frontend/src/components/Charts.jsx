import React from 'react';
import ReactECharts from 'echarts-for-react';

const Charts = ({ report }) => {
  if (!report) {
    return <div className="charts">No data available</div>;
  }

  // Top Products Chart
  const topProductsOption = {
    title: {
      text: 'Top Selling Products'
    },
    tooltip: {},
    xAxis: {
      type: 'category',
      data: report.topProducts?.map(product => product.productName) || []
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      type: 'bar',
      data: report.topProducts?.map(product => product.totalSales) || []
    }]
  };

  // Top Customers Chart
  const topCustomersOption = {
    title: {
      text: 'Top Customers by Spending'
    },
    tooltip: {},
    xAxis: {
      type: 'category',
      data: report.topCustomers?.map(customer => customer.customerName) || []
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      type: 'bar',
      data: report.topCustomers?.map(customer => customer.totalSpent) || []
    }]
  };

  return (
    <div className="charts">
      <div className="chart-container">
        <ReactECharts option={topProductsOption} />
      </div>
      
      <div className="chart-container">
        <ReactECharts option={topCustomersOption} />
      </div>
    </div>
  );
};

export default Charts;