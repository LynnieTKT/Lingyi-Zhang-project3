const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database');
require('dotenv').config();
const { errorHandler } = require('./middleware/errorMiddleware');
const cookieParser = require('cookie-parser');


const app = express();
const PORT = process.env.PORT || 8080;

// Connect Database
connectDB();

// Middlewares
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true,              
}));
app.use(express.json());
app.use(cookieParser());


// Routes
app.use('/api/users', require('./routes/userRoute'));
app.use('/api/status', require('./routes/statusRoute'));
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 


// Serve Frontend
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

// Error Handling Middleware
app.use(errorHandler);

// Start Server
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
