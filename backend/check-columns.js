const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Check the columns in the uploaded CSV file
const checkColumns = async () => {
  try {
    // Look for the uploaded file
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      console.log('Uploads directory does not exist');
      return;
    }
    
    const files = fs.readdirSync(uploadsDir);
    console.log('Files in uploads directory:', files);
    
    // Find the most recent CSV file
    const csvFiles = files.filter(file => file.endsWith('.csv'));
    if (csvFiles.length === 0) {
      console.log('No CSV files found in uploads directory');
      return;
    }
    
    // Sort by modification time to get the most recent
    const sortedFiles = csvFiles.sort((a, b) => {
      const aTime = fs.statSync(path.join(uploadsDir, a)).mtime.getTime();
      const bTime = fs.statSync(path.join(uploadsDir, b)).mtime.getTime();
      return bTime - aTime;
    });
    
    const mostRecentFile = sortedFiles[0];
    const filePath = path.join(uploadsDir, mostRecentFile);
    
    console.log('Checking columns in file:', mostRecentFile);
    
    // Read the first few rows to check column names
    const headers = [];
    let rowCount = 0;
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('headers', (headerList) => {
        console.log('Column headers:', headerList);
      })
      .on('data', (data) => {
        rowCount++;
        if (rowCount <= 3) {
          console.log(`Row ${rowCount}:`, data);
        }
        if (rowCount >= 10) {
          this.destroy(); // Stop reading after 10 rows
        }
      })
      .on('end', () => {
        console.log('Finished reading file. Total rows:', rowCount);
        process.exit(0);
      })
      .on('error', (error) => {
        console.error('Error reading file:', error);
        process.exit(1);
      });
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkColumns();