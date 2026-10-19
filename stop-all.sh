#!/bin/bash

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Robust kill/check block (pre-script)
pkill -f 'pnpm' 2>/dev/null && echo -e "${GREEN}✓ pnpm killed${NC}" || true
pkill -f 'npm' 2>/dev/null && echo -e "${GREEN}✓ npm killed${NC}" || true
pkill -f 'vite' 2>/dev/null && echo -e "${GREEN}✓ vite killed${NC}" || true
pkill -f 'mvn' 2>/dev/null && echo -e "${GREEN}✓ mvn killed${NC}" || true
pkill -f 'spring-boot:run' 2>/dev/null && echo -e "${GREEN}✓ spring-boot:run killed${NC}" || true
killall -q -w -r 'node' 2>/dev/null && echo -e "${GREEN}✓ node killed${NC}" || true
lsof -ti:3001 | xargs kill -9 2>/dev/null && echo -e "${GREEN}✓ Cleared port 3001${NC}" || echo -e "${YELLOW}Port 3001 already free${NC}"
lsof -ti:3000 | xargs kill -9 2>/dev/null && echo -e "${GREEN}✓ Cleared port 3000${NC}" || echo -e "${YELLOW}Port 3000 already free${NC}"

echo -e "${YELLOW}Stopping all GDG services...${NC}"
echo ""

# Stop frontend (Vite)
echo -e "${YELLOW}[1/3]${NC} Stopping Frontend..."
pkill -f "vite" 2>/dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend stopped${NC}"
else
    echo -e "${YELLOW}Frontend was not running${NC}"
fi

# Stop backend (Spring Boot)
echo -e "${YELLOW}[2/3]${NC} Stopping Backend..."
pkill -f "spring-boot:run" 2>/dev/null
pkill -f "gdg-backend" 2>/dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backend stopped${NC}"
else
    echo -e "${YELLOW}Backend was not running${NC}"
fi

# Stop PostgreSQL
echo -e "${YELLOW}[3/3]${NC} Stopping PostgreSQL..."
cd backend
docker-compose down 2>/dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ PostgreSQL stopped${NC}"
else
    echo -e "${YELLOW}PostgreSQL was not running${NC}"
fi
cd ..

echo ""
echo -e "${GREEN}All services stopped!${NC}"
