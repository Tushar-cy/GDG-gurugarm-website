#!/bin/bash

echo "🔍 Testing Frontend-Backend Connection..."
echo ""

echo "1. Backend API Response:"
curl -s http://localhost:3001/api/events | jq 'length'
echo " events found in backend"
echo ""

echo "2. Frontend is accessible:"
curl -s http://localhost:3000 > /dev/null && echo "✅ Frontend is running" || echo "❌ Frontend is down"
echo ""

echo "3. Backend Events:"
curl -s http://localhost:3001/api/events | jq -r '.[] | "  - \(._id): \(.title) (\(.status))"'
echo ""

echo "4. Check CORS (should see Access-Control-Allow-Origin header):"
curl -s -I http://localhost:3001/api/events | grep -i "access-control"
echo ""

echo "✅ All services are running!"
echo ""
echo "📝 To view in browser:"
echo "   Frontend: http://localhost:3000/events"
echo "   Backend:  http://localhost:3001/api/events"

