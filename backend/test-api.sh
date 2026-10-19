#!/bin/bash

# GDG Backend API Testing Script

BASE_URL="http://localhost:3001/api"

echo "🧪 Testing GDG Backend API..."
echo "🌐 Base URL: $BASE_URL"
echo ""

# Test Health Endpoint
echo "1️⃣ Testing Health Endpoint..."
curl -s "$BASE_URL/health" | jq '.' 2>/dev/null || curl -s "$BASE_URL/health"
echo ""

# Test News Endpoints
echo "2️⃣ Testing News Endpoints..."

echo "📰 GET /api/news"
curl -s "$BASE_URL/news" | jq '.' 2>/dev/null || curl -s "$BASE_URL/news"
echo ""

echo "📝 POST /api/news (Create test article)"
curl -s -X POST "$BASE_URL/news" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test News Article",
    "content": "This is a test news article created by the API test script.",
    "author": "Test Author",
    "category": "test",
    "tags": ["test", "api"],
    "featured": false
  }' | jq '.' 2>/dev/null || curl -s -X POST "$BASE_URL/news" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test News Article",
    "content": "This is a test news article created by the API test script.",
    "author": "Test Author",
    "category": "test",
    "tags": ["test", "api"],
    "featured": false
  }'
echo ""

# Test Events Endpoints
echo "3️⃣ Testing Events Endpoints..."

echo "🎉 GET /api/events"
curl -s "$BASE_URL/events" | jq '.' 2>/dev/null || curl -s "$BASE_URL/events"
echo ""

echo "📅 POST /api/events (Create test event)"
curl -s -X POST "$BASE_URL/events" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Event",
    "description": "This is a test event created by the API test script.",
    "date": "2024-12-31",
    "category": "test",
    "status": "upcoming",
    "tags": ["test", "api"]
  }' | jq '.' 2>/dev/null || curl -s -X POST "$BASE_URL/events" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Event",
    "description": "This is a test event created by the API test script.",
    "date": "2024-12-31",
    "category": "test",
    "status": "upcoming",
    "tags": ["test", "api"]
  }'
echo ""

# Test Team Endpoints
echo "4️⃣ Testing Team Endpoints..."

echo "👥 GET /api/team"
curl -s "$BASE_URL/team" | jq '.' 2>/dev/null || curl -s "$BASE_URL/team"
echo ""

echo "👤 POST /api/team (Create test team member)"
curl -s -X POST "$BASE_URL/team" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Member",
    "role": "Test Role",
    "bio": "This is a test team member created by the API test script.",
    "department": "test",
    "skills": ["testing", "api"],
    "isActive": true
  }' | jq '.' 2>/dev/null || curl -s -X POST "$BASE_URL/team" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Member",
    "role": "Test Role",
    "bio": "This is a test team member created by the API test script.",
    "department": "test",
    "skills": ["testing", "api"],
    "isActive": true
  }'
echo ""

echo "✅ API testing completed!"
echo ""
echo "📋 Available endpoints:"
echo "   • Health: $BASE_URL/health"
echo "   • News: $BASE_URL/news"
echo "   • Events: $BASE_URL/events"
echo "   • Team: $BASE_URL/team"
echo "   • Upload: $BASE_URL/upload/image"
echo ""
echo "🔗 Frontend should connect to: http://localhost:3001"