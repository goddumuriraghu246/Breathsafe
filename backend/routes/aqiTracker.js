const express = require('express');
const router = express.Router();
const AQITracker = require('../models/AQITracker');
const auth = require('../middleware/auth');

// Save AQI data
router.post('/save', auth, async (req, res) => {
  try {
    const { city, aqi, status, coordinates, pollutants } = req.body;
    
    const aqiData = new AQITracker({
      userId: req.user.id,
      city,
      aqi,
      status,
      coordinates,
      pollutants
    });

    await aqiData.save();
    res.status(201).json(aqiData);
  } catch (error) {
    console.error('Error saving AQI data:', error);
    res.status(500).json({ message: 'Error saving AQI data' });
  }
});

// Get user's AQI history
router.get('/history', auth, async (req, res) => {
  try {
    const aqiHistory = await AQITracker.find({ userId: req.user.id })
      .sort({ timestamp: -1 })
      .limit(10);
    res.json(aqiHistory);
  } catch (error) {
    console.error('Error fetching AQI history:', error);
    res.status(500).json({ message: 'Error fetching AQI history' });
  }
});

// Get latest AQI data for a user
router.get('/latest', auth, async (req, res) => {
  try {
    const latestAQI = await AQITracker.findOne({ userId: req.user.id })
      .sort({ timestamp: -1 });
    res.json(latestAQI);
  } catch (error) {
    console.error('Error fetching latest AQI data:', error);
    res.status(500).json({ message: 'Error fetching latest AQI data' });
  }
});

module.exports = router;