#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  GDG Gurugram University - Startup    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}Shutting down services...${NC}"
    kill $(jobs -p) 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Kill any existing processes on ports
echo -e "${BLUE}[0/4]${NC} Cleaning up existing processes..."
lsof -ti:3001 | xargs kill -9 2>/dev/null && echo -e "${GREEN}✓ Cleared port 3001${NC}" || echo -e "${YELLOW}Port 3001 already free${NC}"
lsof -ti:3000 | xargs kill -9 2>/dev/null && echo -e "${GREEN}✓ Cleared port 3000${NC}" || echo -e "${YELLOW}Port 3000 already free${NC}"

# Check if PostgreSQL is running
echo -e "\n${BLUE}[1/4]${NC} Checking PostgreSQL..."
if ! command -v docker &>/dev/null; then
    echo -e "${YELLOW}Docker not found. Will use H2 dev profile for backend.${NC}"
    USE_H2_DEV=1
else
    if ! docker ps | grep -q postgres; then
        echo -e "${YELLOW}Starting PostgreSQL with Docker Compose...${NC}"
        cd backend
        if command -v docker-compose &>/dev/null; then
          docker-compose up -d || true
        else
          docker compose up -d || true
        fi
        cd ..
        echo -e "${GREEN}✓ PostgreSQL start attempted${NC}"
        sleep 5
    else
        echo -e "${GREEN}✓ PostgreSQL already running${NC}"
    fi
fi

# Create database if it doesn't exist
if [ -z "$USE_H2_DEV" ]; then
  echo -e "${YELLOW}Creating database if needed...${NC}"
  docker exec -i $(docker ps -q -f name=postgres) psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'gdg_db'" | grep -q 1 || \
  docker exec -i $(docker ps -q -f name=postgres) psql -U postgres -c "CREATE DATABASE gdg_db;"
  echo -e "${GREEN}✓ Database ready${NC}"
fi

# Start Backend
echo -e "\n${BLUE}[2/4]${NC} Starting Backend (Spring Boot on port 3001)..."
cd backend
if [ -n "$USE_H2_DEV" ]; then
  echo -e "${YELLOW}Using H2 dev profile for backend startup (no Postgres).${NC}"
  mvn spring-boot:run -Dspring-boot.run.profiles=dev > ../backend.log 2>&1 &
else
  mvn spring-boot:run > ../backend.log 2>&1 &
fi
BACKEND_PID=$!
cd ..
echo -e "${GREEN}✓ Backend starting... (PID: $BACKEND_PID)${NC}"

# Wait for backend to be ready (reduced timeout)
echo -e "${YELLOW}Waiting for backend to be ready...${NC}"
for i in {1..15}; do
    if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Backend is ready!${NC}"
        BACKEND_READY=1
        break
    fi
    echo -n "."
    sleep 2
done

if [ -z "$BACKEND_READY" ]; then
    echo -e "\n${RED}✗ Backend failed initial start. Checking logs...${NC}"
    tail -30 backend.log || true
    # Detect common DB auth failure and retry with H2 dev profile
    if rg -q "password authentication failed|Unable to open JDBC Connection" backend.log 2>/dev/null; then
        echo -e "${YELLOW}Detected database auth/connection issue. Retrying with H2 dev profile...${NC}"
        kill $BACKEND_PID 2>/dev/null || true
        cd backend
        mvn spring-boot:run -Dspring-boot.run.profiles=dev > ../backend.log 2>&1 &
        BACKEND_PID=$!
        cd ..
        echo -e "${GREEN}✓ Backend restarting with dev profile (PID: $BACKEND_PID)${NC}"
        for i in {1..10}; do
            if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
                echo -e "${GREEN}✓ Backend is ready (dev profile)!${NC}"
                BACKEND_READY=1
                break
            fi
            echo -n "."
            sleep 2
        done
    fi
fi

if [ -z "$BACKEND_READY" ]; then
    echo -e "\n${RED}✗ Backend failed to start. Check backend.log for errors${NC}"
    tail -40 backend.log || true
    exit 1
fi

# Start Frontend
echo -e "\n${BLUE}[3/4]${NC} Starting Frontend (Vite on port 3000)..."
cd mainSite

# Check if pnpm exists, otherwise use npm
if command -v pnpm &> /dev/null; then
    echo -e "${GREEN}Using pnpm${NC}"
    pnpm dev > ../frontend.log 2>&1 &
elif command -v npm &> /dev/null; then
    echo -e "${YELLOW}pnpm not found, using npm${NC}"
    npm run dev > ../frontend.log 2>&1 &
else
    echo -e "${RED}Neither pnpm nor npm found!${NC}"
    exit 1
fi

FRONTEND_PID=$!
cd ..
echo -e "${GREEN}✓ Frontend starting... (PID: $FRONTEND_PID)${NC}"

# Wait for frontend to be ready (reduced timeout)
echo -e "${YELLOW}Waiting for frontend to be ready...${NC}"
for i in {1..10}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Frontend is ready!${NC}"
        break
    fi
    echo -n "."
    sleep 2
done

# Display status
echo -e "\n${BLUE}[4/4]${NC} Services Status:"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "  ${GREEN}✓${NC} PostgreSQL: ${BLUE}localhost:5432${NC}"
echo -e "  ${GREEN}✓${NC} Backend API: ${BLUE}http://localhost:3001${NC}"
echo -e "  ${GREEN}✓${NC} Frontend: ${BLUE}http://localhost:3000${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}Logs:${NC}"
echo -e "  Backend: ${BLUE}tail -f backend.log${NC}"
echo -e "  Frontend: ${BLUE}tail -f frontend.log${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
echo ""

# Keep script running and show logs
tail -f backend.log frontend.log
