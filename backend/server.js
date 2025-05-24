// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const healthAssessmentRoutes = require('./routes/healthAssessment');
const aqiTrackerRoutes = require('./routes/aqiTracker');
// const { MongoClient } = require('mongodb'); // No need to import MongoClient here if using Mongoose's client

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/health', healthAssessmentRoutes);
app.use('/api/aqidetails', aqiTrackerRoutes);

// MongoDB Connection with fallback
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/breathsafe';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    // Don't exit the process, just log the error
  });

// --- API Endpoint for Document Count ---
// This route uses the existing Mongoose connection's underlying MongoClient
app.get('/api/count/:collectionName', async (req, res) => {
  const { collectionName } = req.params;

  // Ensure Mongoose is connected before trying to access the client
  if (mongoose.connection.readyState !== 1) { // 1 means 'connected'
    return res.status(500).json({ error: "Database not connected yet. Please try again in a moment." });
  }

  try {
    // Get the underlying native MongoDB driver's DB object from Mongoose connection
    const db = mongoose.connection.db;
    const collection = db.collection(collectionName);
    const count = await collection.countDocuments({});

    res.json({
      collection: collectionName,
      documentCount: count
    });
  } catch (error) {
    console.error(`Error counting documents in collection '${collectionName}':`, error);
    res.status(500).json({ error: "Failed to retrieve document count.", details: error.message });
  }
});
// --- End API Endpoint for Document Count ---


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: err.message
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});