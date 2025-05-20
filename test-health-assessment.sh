#!/bin/bash

# Replace YOUR_JWT_TOKEN with an actual token after logging in
TOKEN="YOUR_JWT_TOKEN"

# 1. Submit health assessment
echo "Submitting health assessment..."
curl -X POST http://localhost:5000/api/health/assessment \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $TOKEN" \
-d '{
  "name": "John Doe",
  "age": 35,
  "symptoms": ["Cough", "Shortness of breath"],
  "other": "History of asthma",
  "consent": true
}'

echo -e "\n\nWaiting 2 seconds...\n"
sleep 2

# 2. Generate health report
echo "Generating health report..."
curl -X POST http://localhost:5000/api/health/generate \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $TOKEN" \
-d '{
  "location": {
    "latitude": 17.385044,
    "longitude": 78.486671,
    "name": "Hyderabad"
  },
  "aqiData": {
    "value": 150,
    "status": "Unhealthy for Sensitive Groups",
    "pollutants": [
      {
        "name": "PM2.5",
        "label": "PM₂.₅",
        "value": 75.5,
        "unit": "µg/m³"
      }
    ]
  }
}'
