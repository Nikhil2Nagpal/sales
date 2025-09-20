const fs = require('fs');
const path = require('path');

// Create a larger test CSV file to simulate real-world usage
const createLargeTestFile = () => {
  const filePath = path.join(__dirname, 'large-test-data.csv');
  
  // Write header
  const header = 'customerName,customerRegion,customerType,productName,productCategory,price,quantity,totalRevenue,date\n';
  fs.writeFileSync(filePath, header);
  
  // Generate 1000 rows of test data
  let csvContent = '';
  for (let i = 1; i <= 1000; i++) {
    const row = `Customer${i},Region${i % 4 + 1},${i % 2 === 0 ? 'Business' : 'Individual'},Product${i % 10 + 1},Category${i % 3 + 1},${Math.floor(Math.random() * 1000) + 100},${Math.floor(Math.random() * 10) + 1},${Math.floor(Math.random() * 5000) + 500},2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}\n`;
    csvContent += row;
  }
  
  fs.appendFileSync(filePath, csvContent);
  console.log(`Created test file with ${1000} rows at ${filePath}`);
  console.log('File size:', fs.statSync(filePath).size, 'bytes');
};

createLargeTestFile();