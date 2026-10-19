#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Testing GDG Backend APIs             ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

BASE_URL="http://localhost:3001"

# Test Health
echo -e "${YELLOW}[1/4]${NC} Testing Health Endpoint..."
HEALTH=$(curl -s ${BASE_URL}/api/health)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Health check passed${NC}"
    echo "$HEALTH" | jq '.' 2>/dev/null || echo "$HEALTH"
else
    echo -e "${RED}✗ Health check failed${NC}"
fi
echo ""

# Test Events
echo -e "${YELLOW}[2/4]${NC} Testing Events API..."
EVENTS=$(curl -s ${BASE_URL}/api/events)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Events API working${NC}"
    echo "$EVENTS" | jq '. | length' 2>/dev/null || echo "Events count: $(echo $EVENTS | grep -o '"_id"' | wc -l)"
else
    echo -e "${RED}✗ Events API failed${NC}"
fi
echo ""

# Test News
echo -e "${YELLOW}[3/4]${NC} Testing News API..."
NEWS=$(curl -s ${BASE_URL}/api/news)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ News API working${NC}"
    echo "$NEWS" | jq '. | length' 2>/dev/null || echo "News count: $(echo $NEWS | grep -o '"_id"' | wc -l)"
else
    echo -e "${RED}✗ News API failed${NC}"
fi
echo ""

# Test Team
echo -e "${YELLOW}[4/4]${NC} Testing Team API..."
TEAM=$(curl -s ${BASE_URL}/api/team)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Team API working${NC}"
    echo "$TEAM" | jq '. | length' 2>/dev/null || echo "Team count: $(echo $TEAM | grep -o '"_id"' | wc -l)"
else
    echo -e "${RED}✗ Team API failed${NC}"
fi
echo ""

echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}Testing complete!${NC}"


