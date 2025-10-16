#!/bin/bash

# Brand Expression Setup Script
# Research Prototype for Brand Identity Externalization Study

set -e

echo "=========================================="
echo "  Brand Expression - Setup"
echo "  Research Prototype"
echo "=========================================="
echo ""
echo "This research prototype helps brand owners"
echo "externalize tacit brand knowledge using AI."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check Node.js
echo "Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js not installed${NC}"
    echo "Install from: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'.' -f1 | sed 's/v//')
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}✗ Node.js 18+ required (current: $(node -v))${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v)${NC}"

# Check MySQL
if ! command -v mysql &> /dev/null; then
    echo -e "${YELLOW}! MySQL not found in PATH${NC}"
    echo "  Install: brew install mysql (macOS)"
    echo "  Or: sudo apt install mysql-server (Ubuntu)"
fi
echo ""

# Configuration
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Configuration${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# OpenAI API Key
echo -e "${YELLOW}1. OpenAI API Key (Required)${NC}"
echo "   Used for: GPT-4 brand analysis, DALL-E 3 image generation"
echo "   Get key: https://platform.openai.com/api-keys"
echo ""
read -p "   Enter your OpenAI API Key: " OPENAI_KEY

if [ -z "$OPENAI_KEY" ]; then
    echo -e "${RED}✗ OpenAI API key is required!${NC}"
    exit 1
fi
echo ""

# Database Configuration
echo -e "${YELLOW}2. Database Configuration${NC}"
read -p "   MySQL Host [localhost]: " DB_HOST
DB_HOST=${DB_HOST:-localhost}

read -p "   MySQL Port [3306]: " DB_PORT
DB_PORT=${DB_PORT:-3306}

read -p "   Database Name [amond]: " DB_NAME
DB_NAME=${DB_NAME:-amond}

read -p "   MySQL User [root]: " DB_USER
DB_USER=${DB_USER:-root}

echo -n "   MySQL Password: "
read -s DB_PASSWORD
echo ""
echo ""

# AWS S3 (Optional)
echo -e "${YELLOW}3. AWS S3 (Optional - for image storage)${NC}"
echo "   If skipped, images stored as base64 in database"
read -p "   Configure AWS S3? (y/n) [n]: " AWS_SETUP

if [ "$AWS_SETUP" = "y" ] || [ "$AWS_SETUP" = "Y" ]; then
    read -p "   AWS Access Key ID: " AWS_KEY
    read -p "   AWS Secret Access Key: " AWS_SECRET
    read -p "   S3 Bucket Name: " S3_BUCKET
    AWS_REGION="ap-northeast-2"
else
    AWS_KEY="not_configured"
    AWS_SECRET="not_configured"
    S3_BUCKET="not_configured"
    AWS_REGION="ap-northeast-2"
fi
echo ""

# Generate secrets
SESSION_SECRET=$(openssl rand -base64 32 2>/dev/null || echo "session_$(date +%s)_$(openssl rand -hex 16)")
CRYPTO_KEY=$(openssl rand -base64 16 2>/dev/null || echo "crypto_$(date +%s)")
CRYPTO_DELETED_KEY=$(openssl rand -base64 16 2>/dev/null || echo "deleted_$(date +%s)")

# Create backend .env
echo -e "${BLUE}Creating configuration files...${NC}"
cat > amond-backend/.env << EOF
# Brand Expression - Research Prototype Configuration
# Generated: $(date)

# OpenAI API
OPENAI_API_KEY=${OPENAI_KEY}

# Database
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}
DB_DATABASE=${DB_NAME}
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}

# AWS S3 (Optional)
AWS_ACCESS_KEY_ID=${AWS_KEY}
AWS_SECRET_ACCESS_KEY=${AWS_SECRET}
AWS_REGION=${AWS_REGION}
AWS_S3_BUCKET=${S3_BUCKET}

# Server
NODE_ENV=dev
PORT=9988
SESSION_SECRET=${SESSION_SECRET}
CRYPTO_KEY=${CRYPTO_KEY}
CRYPTO_DELETED_KEY=${CRYPTO_DELETED_KEY}

# Optional: Email (not required)
SES_FROM_EMAIL=noreply@example.com

# Optional: Social login (email login works without these)
# KAKAO_REST_API=
# GOOGLE_CLIENT_ID=
# GOOGLE_CLIENT_SECRET=
EOF

# Create frontend .env.local
cat > amond-frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:9988
EOF

echo -e "${GREEN}✓ Configuration files created${NC}"
echo ""

# Install dependencies
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Installing Dependencies${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo "Backend..."
cd amond-backend && npm install --silent && cd .. || exit 1
echo -e "${GREEN}✓ Backend dependencies installed${NC}"

echo "Frontend..."
cd amond-frontend && npm install --silent && cd .. || exit 1
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
echo ""

# Database setup
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Database Setup${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Test MySQL connection
echo "Testing MySQL connection..."
if [ -z "$DB_PASSWORD" ]; then
    TEST_CMD="mysql -h${DB_HOST} -P${DB_PORT} -u${DB_USER} -e 'SELECT 1' 2>&1"
else
    TEST_CMD="mysql -h${DB_HOST} -P${DB_PORT} -u${DB_USER} -p${DB_PASSWORD} -e 'SELECT 1' 2>&1"
fi

if eval "$TEST_CMD" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ MySQL connection successful${NC}"

    # Run database initialization
    echo "Initializing database..."
    if [ -z "$DB_PASSWORD" ]; then
        mysql -h${DB_HOST} -P${DB_PORT} -u${DB_USER} < amond-backend/sql/00_init_database.sql 2>&1 | grep -v "Warning" || true
    else
        mysql -h${DB_HOST} -P${DB_PORT} -u${DB_USER} -p${DB_PASSWORD} < amond-backend/sql/00_init_database.sql 2>&1 | grep -v "Warning" || true
    fi

    echo -e "${GREEN}✓ Database initialized${NC}"
else
    echo -e "${YELLOW}! Could not connect to MySQL${NC}"
    echo "  You can initialize the database manually:"
    if [ -z "$DB_PASSWORD" ]; then
        echo "  mysql -h${DB_HOST} -u${DB_USER} < amond-backend/sql/00_init_database.sql"
    else
        echo "  mysql -h${DB_HOST} -u${DB_USER} -p < amond-backend/sql/00_init_database.sql"
    fi
fi

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  Setup Complete! 🎉${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}Research Mode Features:${NC}"
echo "  • Unlimited usage (no limits)"
echo "  • High-quality image generation"
echo "  • Moodboard generation"
echo "  • Full access to all features"
echo ""
echo -e "${YELLOW}Start the application:${NC}"
echo "  ./start.sh"
echo ""
echo -e "${YELLOW}Or start manually:${NC}"
echo "  Terminal 1: cd amond-backend && npm run dev"
echo "  Terminal 2: cd amond-frontend && npm run dev"
echo ""
echo -e "${YELLOW}Access:${NC}"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:9988"
echo ""
echo "Default test account (created automatically):"
echo "  Email: test@example.com"
echo "  Password: test1234"
echo ""
