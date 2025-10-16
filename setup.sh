#!/bin/bash

# Brand Expression Setup Script
# This script helps you set up the development environment

set -e

echo "=========================================="
echo "Brand Expression - Setup Script"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed.${NC}"
    echo "Please install Node.js (v18 or higher) from https://nodejs.org/"
    exit 1
fi

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo -e "${YELLOW}Warning: MySQL is not found in PATH.${NC}"
    echo "Please ensure MySQL is installed and running."
    echo "On macOS: brew install mysql && brew services start mysql"
    echo ""
    read -p "Press enter to continue or Ctrl+C to exit..."
fi

echo -e "${GREEN}✓ Prerequisites check passed${NC}"
echo ""

# Create .env file if it doesn't exist
if [ ! -f "amond-backend/.env" ]; then
    echo -e "${YELLOW}Setting up environment variables...${NC}"
    echo ""

    # Prompt for OpenAI API Key
    echo "Please enter your OpenAI API Key:"
    echo "(You can get one from https://platform.openai.com/api-keys)"
    read -p "OpenAI API Key: " OPENAI_KEY

    # Prompt for AWS credentials (optional)
    echo ""
    echo "AWS S3 is used for image storage (optional - images will be stored as base64 if skipped)"
    read -p "Do you want to configure AWS S3? (y/n): " AWS_SETUP

    if [ "$AWS_SETUP" = "y" ] || [ "$AWS_SETUP" = "Y" ]; then
        read -p "AWS Access Key ID: " AWS_KEY
        read -p "AWS Secret Access Key: " AWS_SECRET
        read -p "AWS S3 Bucket Name: " S3_BUCKET
        AWS_REGION="ap-northeast-2"
    else
        AWS_KEY="not_configured"
        AWS_SECRET="not_configured"
        S3_BUCKET="not_configured"
        AWS_REGION="ap-northeast-2"
    fi

    # Database configuration
    echo ""
    echo "Database Configuration (MySQL)"
    read -p "Database Host [localhost]: " DB_HOST
    DB_HOST=${DB_HOST:-localhost}
    read -p "Database Port [3306]: " DB_PORT
    DB_PORT=${DB_PORT:-3306}
    read -p "Database Name [amond]: " DB_NAME
    DB_NAME=${DB_NAME:-amond}
    read -p "Database User [root]: " DB_USER
    DB_USER=${DB_USER:-root}
    read -p "Database Password: " -s DB_PASSWORD
    echo ""

    # Generate random session secret
    SESSION_SECRET=$(openssl rand -base64 32 2>/dev/null || echo "change_this_to_a_random_string")

    # Create backend .env file
    cat > amond-backend/.env << EOF
# OpenAI API Configuration
OPENAI_API_KEY=${OPENAI_KEY}

# AWS Configuration
AWS_ACCESS_KEY_ID=${AWS_KEY}
AWS_SECRET_ACCESS_KEY=${AWS_SECRET}
AWS_REGION=${AWS_REGION}
AWS_S3_BUCKET=${S3_BUCKET}

# Database Configuration
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}
DB_DATABASE=${DB_NAME}
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}

# Server Configuration
PORT=9988
NODE_ENV=dev

# Session Secret
SESSION_SECRET=${SESSION_SECRET}
EOF

    # Create frontend .env.local file
    cat > amond-frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:9988
EOF

    echo -e "${GREEN}✓ Environment variables configured${NC}"
else
    echo -e "${GREEN}✓ .env file already exists${NC}"
fi

echo ""
echo -e "${YELLOW}Installing dependencies...${NC}"

# Install backend dependencies
echo "Installing backend dependencies..."
cd amond-backend
npm install
cd ..

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd amond-frontend
npm install
cd ..

echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Database setup
echo -e "${YELLOW}Setting up database...${NC}"
echo "Please ensure MySQL is running and you have created the database."
echo ""
read -p "Do you want to run database migrations now? (y/n): " RUN_MIGRATIONS

if [ "$RUN_MIGRATIONS" = "y" ] || [ "$RUN_MIGRATIONS" = "Y" ]; then
    echo "Running database setup..."
    source amond-backend/.env
    mysql -h${DB_HOST} -P${DB_PORT} -u${DB_USER} -p${DB_PASSWORD} ${DB_DATABASE} < amond-backend/sql/initial_schema.sql 2>/dev/null || echo "Database schema may already exist or needs manual setup"
    echo -e "${GREEN}✓ Database setup completed${NC}"
else
    echo "Skipping database migrations. You can run them later with:"
    echo "  mysql -u root -p amond < amond-backend/sql/initial_schema.sql"
fi

echo ""
echo "=========================================="
echo -e "${GREEN}Setup Complete!${NC}"
echo "=========================================="
echo ""
echo "To start the application:"
echo "  ./start.sh"
echo ""
echo "Or manually:"
echo "  Terminal 1: cd amond-backend && npm run dev"
echo "  Terminal 2: cd amond-frontend && npm run dev"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:9988"
echo ""
