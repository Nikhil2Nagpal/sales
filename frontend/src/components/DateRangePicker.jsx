import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateRangePicker = ({ onDateRangeChange }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const handleApply = () => {
    if (onDateRangeChange) {
      // Check if startDate and endDate are Date objects or strings
      const start = startDate instanceof Date ? startDate.toISOString() : startDate;
      const end = endDate instanceof Date ? endDate.toISOString() : endDate;
      
      onDateRangeChange(start, end);
    }
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handleStartDateManualChange = (e) => {
    const date = new Date(e.target.value);
    if (!isNaN(date.getTime())) {
      setStartDate(date);
    }
  };

  const handleEndDateManualChange = (e) => {
    const date = new Date(e.target.value);
    if (!isNaN(date.getTime())) {
      setEndDate(date);
    }
  };

  // Format date for input field
  const formatDateForInput = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      return date.toISOString().split('T')[0];
    }
    if (typeof date === 'string') {
      const d = new Date(date);
      if (!isNaN(d)) {
        return d.toISOString().split('T')[0];
      }
    }
    return new Date().toISOString().split('T')[0];
  };

  return (
    <div className="date-range-picker">
      <div className="date-picker-group">
        <label>Start Date:</label>
        <DatePicker 
          selected={startDate} 
          onChange={handleStartDateChange} 
          selectsStart
          startDate={startDate}
          endDate={endDate}
        />
        <input
          type="date"
          value={formatDateForInput(startDate)}
          onChange={handleStartDateManualChange}
          className="manual-date-input"
        />
      </div>
      
      <div className="date-picker-group">
        <label>End Date:</label>
        <DatePicker 
          selected={endDate} 
          onChange={handleEndDateChange} 
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
        />
        <input
          type="date"
          value={formatDateForInput(endDate)}
          onChange={handleEndDateManualChange}
          className="manual-date-input"
        />
      </div>
      
      <button onClick={handleApply} className="apply-button">
        Apply
      </button>
    </div>
  );
};

export default DateRangePicker;