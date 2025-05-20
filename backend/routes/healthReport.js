const express = require('express');
const jwt = require('jsonwebtoken');
const HealthReport = require('../models/HealthReport');
const HealthAssessment = require('../models/HealthAssessment');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Middleware to verify JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Please authenticate' });
  }
};

// Generate health report
router.post('/generate', auth, async (req, res) => {
  try {
    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not configured');
      return res.status(500).json({
        success: false,
        message: 'AI service is not properly configured. Please contact support.'
      });
    }

    console.log('Generating health report for user:', req.userId);
    const { location, aqiData } = req.body;

    if (!location || !aqiData) {
      console.error('Missing required data:', { location, aqiData });
      return res.status(400).json({
        success: false,
        message: 'Missing required data: location and aqiData are required'
      });
    }

    console.log('Fetching health assessment for user:', req.userId);
    
    // Get latest health assessment with all user data
    const healthAssessment = await HealthAssessment.findOne({ userId: req.userId })
      .sort({ timestamp: -1 })
      .lean();

    console.log('Found health assessment:', healthAssessment);

    if (!healthAssessment) {
      console.log('No health assessment found');
      return res.status(400).json({
        success: false,
        message: 'Please complete a health assessment first'
      });
    }

    if (!healthAssessment.name || !healthAssessment.age || !healthAssessment.symptoms) {
      console.log('Invalid health assessment data:', { 
        name: healthAssessment.name, 
        age: healthAssessment.age, 
        symptoms: healthAssessment.symptoms 
      });
      return res.status(400).json({
        success: false,
        message: 'Your health assessment is incomplete. Please update it with all required information.'
      });
    }



    // Check if health assessment is recent (within last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    if (new Date(healthAssessment.timestamp) < thirtyDaysAgo) {
      console.log('Health assessment is older than 30 days for user:', req.userId);
      return res.status(400).json({
        success: false,
        message: 'Your health assessment is more than 30 days old. Please fill out a new health assessment form for accurate recommendations.'
      });
    }

    console.log('Found valid health assessment:', {
      name: healthAssessment.name,
      age: healthAssessment.age,
      symptoms: healthAssessment.symptoms,
      hasOtherSymptoms: !!healthAssessment.other,
      timestamp: healthAssessment.timestamp
    });

    // Enhanced prompt for Gemini with detailed age-specific analysis
    const prompt = `You are an expert health advisor specializing in air quality impacts across different age groups. Based on the following detailed health information, provide comprehensive health recommendations:

    Current Air Quality Status:
    - AQI Value: ${aqiData.value}
    - AQI Category: ${aqiData.status}
    - Detailed Pollutant Levels: ${aqiData.pollutants.map(p => `${p.label}: ${p.value}${p.unit}`).join(', ')}
    
    User Health Profile:
    - Name: ${healthAssessment.name}
    - Age: ${healthAssessment.age} years old
    - Reported Health Issues: ${healthAssessment.symptoms.join(', ')}
    ${healthAssessment.other ? `- Additional Health Information: ${healthAssessment.other}` : ''}
    
    Please consider the following in your recommendations:
    1. Age-specific vulnerabilities (${healthAssessment.age} years old)
    2. Reported health issues: ${healthAssessment.symptoms.join(', ')}
    3. Current AQI level and pollutants
    4. Any additional health information provided

    Return a JSON object with exactly this structure:
    {
      "userProfile": {
        "age": ${healthAssessment.age},
        "ageGroup": "[determine appropriate age group: infant/child/teen/adult/senior]",
        "riskLevel": "[low/moderate/high based on age and AQI]"
      },
      "generalRecommendations": [
        "List practical daily actions for the current AQI level"
      ],
      "ageSpecificRecommendations": [
        "Detailed recommendations specifically tailored for the user's age group"
      ],
      "healthSpecificRecommendations": [
        "Recommendations based on reported symptoms and their severity"
      ],
      "emergencyWarnings": [
        "Include if AQI > 150 or severe symptoms present"
      ],
      "activityGuidelines": {
        "outdoor": "Specific guidance for outdoor activities",
        "indoor": "Specific guidance for indoor activities",
        "exercise": "Exercise recommendations based on age and AQI"
      },
      "protectiveMeasures": [
        "Specific protective measures based on age group and symptoms"
      ]
    }

    Consider these age-specific factors:
    - For children (0-12): Focus on activity restrictions and indoor play alternatives
    - For teens (13-19): Balance activity needs with air quality risks
    - For adults (20-59): Consider work-related exposure and exercise modifications
    - For seniors (60+): Emphasize respiratory protection and indoor air quality

    If any of these symptoms are reported, include specific warnings:
    - 'Shortness of breath': Immediate medical attention may be needed
    - 'Chest tightness': Could indicate serious respiratory distress
    - 'Wheezing': May require bronchodilator use if prescribed

    For high AQI levels (>150):
    - Include immediate protective actions
    - Specify indoor air quality measures
    - List emergency warning signs

    Make all recommendations specific, actionable, and appropriate for the user's exact age.`;

    console.log('Sending prompt to Gemini API');
    
    try {
      // Generate report using Gemini
      console.log('Initializing Gemini model...');
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      console.log('Model initialized successfully');
      
      console.log('Generating content...');
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      });
      
      console.log('Getting response...');
      const response = await result.response;
      const responseText = response.text();
      console.log('Response text:', responseText);
      
      let reportData;
      try {
        // Clean the response text to ensure it's valid JSON
        const cleanedText = responseText.replace(/```json\n?|\n?```/g, '').trim();
        reportData = JSON.parse(cleanedText);
        console.log('Successfully parsed JSON response:', reportData);
      } catch (parseError) {
        console.error('Error parsing Gemini response:', parseError);
        console.error('Raw response:', responseText);
        throw new Error('Failed to parse AI response. Please try again.');
      }

      // Validate report data structure
      if (!reportData.generalRecommendations || !reportData.ageSpecificRecommendations || !reportData.healthSpecificRecommendations) {
        console.error('Invalid report data structure:', reportData);
        throw new Error('Invalid response format from AI');
      }

      // Prepare health report data
      const healthReportData = {
        userId: req.userId,
        location: req.body.location,
        aqiData: req.body.aqiData,
        healthData: {
          name: healthAssessment.name,
          age: healthAssessment.age,
          symptoms: healthAssessment.symptoms,
          other: healthAssessment.other || '',
          assessmentDate: healthAssessment.timestamp
        },
        report: {
          userProfile: {
            name: healthAssessment.name,
            age: healthAssessment.age,
            ageGroup: reportData.userProfile?.ageGroup || `${healthAssessment.age < 18 ? 'Child' : healthAssessment.age < 60 ? 'Adult' : 'Senior'}`,
            riskLevel: reportData.userProfile?.riskLevel || 'Medium'
          },
          generalRecommendations: reportData.generalRecommendations || [],
          ageSpecificRecommendations: reportData.ageSpecificRecommendations || [],
          healthSpecificRecommendations: reportData.healthSpecificRecommendations || [],
          activityGuidelines: {
            outdoor: reportData.activityGuidelines?.outdoor || '',
            indoor: reportData.activityGuidelines?.indoor || '',
            exercise: reportData.activityGuidelines?.exercise || ''
          },
          protectiveMeasures: reportData.protectiveMeasures || []
        }
      };

      console.log('Creating health report with data:', healthReportData);

      // Create and save the health report
      const healthReport = new HealthReport(healthReportData);

      console.log('Health report created:', healthReport);

      await healthReport.save();
      console.log('Successfully saved health report');

      // Send response with user details
      const responseData = {
        success: true,
        message: 'Health report generated successfully',
        report: {
          _id: healthReport._id,
          timestamp: healthReport.timestamp,
          personalInfo: {
            name: healthAssessment.name,
            age: healthAssessment.age,
            ageGroup: reportData.userProfile.ageGroup,
            riskLevel: reportData.userProfile.riskLevel
          },
          location: healthReport.location,
          airQuality: {
            ...healthReport.aqiData,
            timestamp: new Date()
          },
          healthStatus: {
            reportedIssues: healthAssessment.symptoms,
            additionalInfo: healthAssessment.other || '',
            lastAssessmentDate: healthAssessment.timestamp
          },
          recommendations: {
            general: reportData.generalRecommendations,
            ageSpecific: reportData.ageSpecificRecommendations,
            healthSpecific: reportData.healthSpecificRecommendations,
            activities: {
              outdoor: reportData.activityGuidelines?.outdoor || '',
              indoor: reportData.activityGuidelines?.indoor || '',
              exercise: reportData.activityGuidelines?.exercise || ''
            },
            precautions: reportData.protectiveMeasures || []
          }
        }
      };

      console.log('Sending health report with user details:', {
        name: responseData.report.personalInfo.name,
        age: responseData.report.personalInfo.age
      });

      res.status(200).json(responseData);
    } catch (geminiError) {
      console.error('Gemini API error:', geminiError);
      console.error('Error details:', {
        name: geminiError.name,
        message: geminiError.message,
        stack: geminiError.stack
      });
      
      // Check for specific API key related errors
      if (geminiError.message.includes('API key') || geminiError.message.includes('authentication')) {
        return res.status(500).json({
          success: false,
          message: 'Invalid API key. Please check your configuration.',
          error: 'API_KEY_ERROR'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Error generating health report with AI',
        error: geminiError.message
      });
    }
  } catch (error) {
    console.error('Server error in /generate:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({
      success: false,
      message: 'Error generating health report',
      error: error.message
    });
  }
});

// Get user's health reports
router.get('/my-reports', auth, async (req, res) => {
  try {
    const reports = await HealthReport.find({ userId: req.userId })
      .sort({ 'report.timestamp': -1 });
    res.json({
      success: true,
      reports
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reports',
      error: error.message
    });
  }
});

// Get specific health report
router.get('/report/:id', auth, async (req, res) => {
  try {
    const report = await HealthReport.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.json({
      success: true,
      report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching report',
      error: error.message
    });
  }
});

module.exports = router;
