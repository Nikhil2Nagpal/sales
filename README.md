# Sales Analytics Dashboard

A professional-grade Sales Analytics Dashboard built with the MERN stack (MongoDB, Express.js, React, Node.js) for comprehensive sales data visualization and analysis.

## 🚀 Features

- **Date-range filtering** for precise sales data analysis with both calendar picker and manual input
- **Data aggregation** for key metrics (total revenue, average order value, top products/customers)
- **Interactive charts** and data visualizations using ECharts
- **Reports history** for tracking historical performance
- **CSV Data Import** for easy bulk data upload with improved error handling and progress tracking
- **Fully responsive design** for all device sizes
- **Professional UI/UX** with modern styling and animations

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, ECharts, react-datepicker
- **Backend**: Node.js, Express.js, MongoDB with Mongoose
- **Database**: MongoDB (local or MongoDB Atlas)
- **Styling**: CSS3 with modern layout techniques and gradients
- **Development Tools**: ESLint, Concurrently, Dotenv

## 📁 Project Structure

```
sales-dashboard/
├── backend/
│   ├── controllers/          # Business logic
│   ├── models/               # Database models
│   ├── routes/               # API routes
│   ├── uploads/              # Temporary file storage
│   ├── .env                  # Environment variables
│   ├── seed.js               # Database seeder
│   ├── test-upload.js        # Test data generator
│   └── server.js             # Express server
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   ├── utils/            # Utility functions
│   │   ├── App.jsx           # Main app component
│   │   └── App.css           # Global styles
│   └── vite.config.js        # Vite configuration
├── SAMPLE_SALES_DATA.csv     # Sample CSV data template
├── LARGE_TEST_DATA.csv       # Large test data for upload testing
├── CSV_UPLOAD_GUIDE.md       # Instructions for CSV import
├── TROUBLESHOOTING.md        # Common issues and solutions
├── API_DOCUMENTATION.md      # API endpoints specification
├── README.md                 # Project documentation
└── package.json              # Root dependencies
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)

### MongoDB Setup

#### Option 1: Local MongoDB
1. Install MongoDB Community Server
2. Start MongoDB service
3. The application will connect to `mongodb://localhost:27017/salesdb` by default

#### Option 2: MongoDB Atlas (Recommended)
1. Create a free MongoDB Atlas account
2. Create a new cluster and database user
3. Update the `.env` file in the `backend` directory:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string_here
   ```

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd sales-dashboard
   ```

2. **Install root dependencies:**
   ```bash
   npm install
   ```

3. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

4. **Install frontend dependencies:**
   ```bash
   cd ../frontend
   npm install
   cd ..
   ```

5. **Seed the database with sample data:**
   ```bash
   cd backend
   npm run seed
   ```

### Development

1. **Start both frontend and backend concurrently:**
   ```bash
   npm run dev
   ```

2. **Or start services separately:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

3. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

### Production

1. **Build the frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Start the production server:**
   ```bash
   cd ../backend
   npm start
   ```

## 📊 API Endpoints

- `GET /api/health` - Health check
- `GET /api/analytics/report?startDate=&endDate=` - Generate analytics report
- `GET /api/analytics/reports` - Get all historical reports
- `POST /api/upload/csv` - Upload and process CSV data

## 🎨 UI Components

1. **DateRangePicker** - Calendar interface for selecting analysis periods with manual input option
2. **KeyMetrics** - Dashboard showing core sales metrics with professional styling
3. **Charts** - Interactive visualizations for top products and customers
4. **ReportsHistory** - Table view of historical reports with hover effects
5. **CSV Upload** - Drag and drop interface for importing sales data with progress tracking

## 📈 Data Visualization

The dashboard includes:
- Bar charts for top-selling products
- Bar charts for top customers by spending
- Key metrics cards with gradient text effects
- Responsive grid layouts for all screen sizes

## 📤 CSV Data Import

The dashboard now supports importing sales data via CSV files:

1. **Easy Data Import**: Upload CSV files to add bulk sales data
2. **Sample Template**: Use [SAMPLE_SALES_DATA.csv](SAMPLE_SALES_DATA.csv) as a template
3. **Automatic Processing**: New customers, products, and sales are automatically created
4. **Real-time Updates**: Dashboard updates immediately after successful upload
5. **Improved Error Handling**: Better timeout handling and error messages
6. **Progress Tracking**: See upload progress for large files

See [CSV_UPLOAD_GUIDE.md](CSV_UPLOAD_GUIDE.md) for detailed instructions.

## 📅 Date Selection

The dashboard now supports two ways to select dates:
1. **Calendar Picker**: Click on the date field to open a calendar
2. **Manual Input**: Type dates directly in YYYY-MM-DD format

## 🐛 Common Issues and Fixes

### Upload Timeout Errors
This issue has been comprehensively addressed by:
- Removing timeout limits for large file uploads
- Increasing file size limit to 50MB
- Implementing streaming and batch processing
- Adding progress tracking for better user feedback
- Better error handling and user feedback
- Automatic cleanup of temporary files

### Date Selection Issues
Fixed by adding manual date input fields alongside the calendar picker.

## 🎨 Professional Styling Features

The dashboard features a modern, professional design with:

- **Gradient Color Scheme**: Blue-violet primary colors with smooth transitions
- **Card-based Layout**: Elegant cards with subtle shadows and hover effects
- **Responsive Design**: Adapts to all screen sizes from mobile to desktop
- **Animated Transitions**: Smooth animations for interactive elements
- **Typography Hierarchy**: Clear visual hierarchy with proper font sizing
- **Consistent Spacing**: Uniform padding and margins throughout
- **Interactive Elements**: Buttons and cards with hover states and feedback

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is built for Shanture's Fresher Hiring Challenge.

## 📞 Support

For issues and questions, please open an issue in the repository.