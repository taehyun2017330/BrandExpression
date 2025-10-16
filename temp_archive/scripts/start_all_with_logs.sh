#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting Amond Application...${NC}"

# Function to kill processes on specific ports
kill_port() {
    local port=$1
    local pid=$(lsof -ti :$port 2>/dev/null)
    if [ ! -z "$pid" ]; then
        echo -e "${RED}Killing process on port $port (PID: $pid)${NC}"
        kill -9 $pid 2>/dev/null
        sleep 1
    fi
}

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}Shutting down all services...${NC}"
    
    # Kill backend and frontend processes
    if [ ! -z "$BACKEND_PID" ]; then
        kill -9 $BACKEND_PID 2>/dev/null
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill -9 $FRONTEND_PID 2>/dev/null
    fi
    
    # Kill any remaining node processes on our ports
    kill_port 9988
    kill_port 3000
    
    # Stop MySQL if it was started by us
    if [ "$MYSQL_STARTED" = true ]; then
        echo -e "${YELLOW}Stopping MySQL...${NC}"
        brew services stop mysql@8.0
    fi
    
    echo -e "${GREEN}All services stopped.${NC}"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup EXIT INT TERM

# Kill any existing processes on our ports
echo -e "${YELLOW}Cleaning up existing processes...${NC}"
kill_port 9988  # Backend port
kill_port 3000  # Frontend port

# Check if MySQL is running
MYSQL_STATUS=$(brew services list | grep "mysql@8.0" | awk '{print $2}')
MYSQL_STARTED=false

if [ "$MYSQL_STATUS" != "started" ]; then
    echo -e "${GREEN}Starting MySQL...${NC}"
    brew services start mysql@8.0 2>/dev/null || {
        echo -e "${YELLOW}MySQL service already exists, restarting...${NC}"
        brew services restart mysql@8.0 2>/dev/null
    }
    MYSQL_STARTED=true
    sleep 3  # Give MySQL time to start
else
    echo -e "${GREEN}MySQL is already running.${NC}"
fi

# Verify MySQL is accessible
echo -e "${YELLOW}Verifying MySQL connection...${NC}"
if mysql -u root -pQkdwkWkd12@@ -e "SELECT 1" >/dev/null 2>&1; then
    echo -e "${GREEN}MySQL connection successful!${NC}"
else
    echo -e "${RED}Warning: MySQL connection failed. Backend may have database issues.${NC}"
fi

# Create named pipes for output
BACKEND_PIPE=$(mktemp -u)
FRONTEND_PIPE=$(mktemp -u)
mkfifo "$BACKEND_PIPE"
mkfifo "$FRONTEND_PIPE"

# Start backend with colored prefix
echo -e "${GREEN}Starting backend server...${NC}"
cd amond-backend
(npx nodemon app.ts 2>&1 | while IFS= read -r line; do
    echo -e "${BLUE}[BACKEND]${NC} $line"
done) &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to initialize
sleep 3

# Start frontend with colored prefix
echo -e "${GREEN}Starting frontend server...${NC}"
cd amond-frontend
(npm run dev 2>&1 | while IFS= read -r line; do
    echo -e "${MAGENTA}[FRONTEND]${NC} $line"
done) &
FRONTEND_PID=$!
cd ..

echo -e "\n${GREEN}All services started successfully!${NC}"
echo -e "${YELLOW}Backend running on: ${GREEN}http://localhost:9988${NC}"
echo -e "${YELLOW}Frontend running on: ${GREEN}http://localhost:3000${NC}"
echo -e "\n${RED}Note: If you see service worker errors in the browser:${NC}"
echo -e "1. Open ${GREEN}file://${PWD}/clear-service-worker.html${NC} in your browser"
echo -e "2. Click 'Clear Service Worker & Cache'"
echo -e "3. Return to http://localhost:3000 and hard refresh (Cmd+Shift+R)\n"
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}\n"

# Wait for all background processes
wait