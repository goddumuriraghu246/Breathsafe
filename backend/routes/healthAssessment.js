const express = require('express');
const jwt = require('jsonwebtoken');
const HealthAssessment = require('../models/HealthAssessment');
const router = express.Router();

// Middleware to verify JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

// Submit health assessment
router.post('/assessment', auth, async (req, res) => {
  try {
    const { age, symptoms, other, consent } = req.body;
    
    const assessment = new HealthAssessment({
      userId: req.userId,
      age,
      symptoms,
      other,
      consent,
      timestamp: new Date()
    });

    await assessment.save();
    res.status(201).json({ 
      success: true,
      message: 'Health assessment submitted successfully',
      assessment 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error submitting assessment', 
      error: error.message 
    });
  }
});

// Get user's health assessments
router.get('/my-assessments', auth, async (req, res) => {
  try {
    const assessments = await HealthAssessment.find({ userId: req.userId })
      .sort({ timestamp: -1 });
    res.json({
      success: true,
      assessments
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching assessments', 
      error: error.message 
    });
  }
});

// Get assessment by ID
router.get('/assessment/:id', auth, async (req, res) => {
  try {
    const assessment = await HealthAssessment.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    res.json({
      success: true,
      assessment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching assessment',
      error: error.message
    });
  }
});

module.exports = router; 