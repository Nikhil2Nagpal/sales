const express = require('express');
const router = express.Router();
const { 
  generateReport, 
  getAllReports 
} = require('../controllers/analyticsController');

// Generate a new analytics report
router.get('/report', generateReport);

// Get all reports
router.get('/reports', getAllReports);

module.exports = router;