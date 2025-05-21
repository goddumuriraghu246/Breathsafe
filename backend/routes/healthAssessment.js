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
router.post('/', auth, async (req, res) => {
  try {
    const { name, age, symptoms, other, consent } = req.body;
    
    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      });
    }

    if (!age || isNaN(age) || age < 0 || age > 120) {
      return res.status(400).json({
        success: false,
        message: 'Valid age between 0 and 120 is required'
      });
    }

    if (!Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one symptom must be selected'
      });
    }

    if (!consent) {
      return res.status(400).json({
        success: false,
        message: 'Consent is required'
      });
    }

    const assessment = new HealthAssessment({
      userId: req.userId,
      name: name.trim(),
      age: Number(age),
      symptoms,
      other: other || '',
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
router.get('/:id', auth, async (req, res) => {
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