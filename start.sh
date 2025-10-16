#!/bin/bash

# Brand Expression - Start Script
# Starts both frontend and backend servers

set -e

echo "=========================================="
echo "Brand Expression - Starting Services"
echo "=========================================="
echo ""

# Check if .env file exists
if [ ! -f "amond-backend/.env" ]; then
    echo "Error: .env file not found!"
    echo "Please run ./setup.sh first"
    exit 1
fi

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Function to cleanup background processes
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down services...${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    exit 0
}

trap cleanup INT TERM

echo -e "${BLUE}Starting Backend Server...${NC}"
cd amond-backend
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

sleep 3

echo -e "${BLUE}Starting Frontend Server...${NC}"
cd amond-frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo ""
echo -e "${GREEN}✓ Services started!${NC}"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:9988"
echo ""
echo "Logs:"
echo "  Backend:  tail -f backend.log"
echo "  Frontend: tail -f frontend.log"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
