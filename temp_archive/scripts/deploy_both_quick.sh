#!/bin/bash

# Quick deployment script - commits and pushes without confirmation
# Usage: ./deploy_both_quick.sh "commit message"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get commit message from argument or use default
COMMIT_MSG="${1:-Update frontend and backend}"

echo -e "${YELLOW}🚀 Quick Deploy - Amond Frontend & Backend${NC}"
echo -e "${YELLOW}=========================================${NC}"
echo ""

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Deploy Frontend
echo -e "${GREEN}🎨 Deploying Frontend...${NC}"
cd "$SCRIPT_DIR/amond-frontend" || exit 1

# Check current status
echo "Frontend status:"
git status -s
echo ""

# Add, commit and push
git add .
git commit -m "$COMMIT_MSG" || echo "No changes to commit in frontend"
git push origin main || echo "Failed to push frontend"

echo -e "${GREEN}✅ Frontend done!${NC}"
echo ""

# Deploy Backend
echo -e "${GREEN}⚙️  Deploying Backend...${NC}"
cd "$SCRIPT_DIR/amond-backend" || exit 1

# Check current status
echo "Backend status:"
git status -s
echo ""

# Add, commit and push
git add .
git commit -m "$COMMIT_MSG" || echo "No changes to commit in backend"
git push origin main || echo "Failed to push backend"

echo -e "${GREEN}✅ Backend done!${NC}"
echo ""

echo -e "${GREEN}🎉 Deployment completed!${NC}"
echo ""
echo "Frontend: https://github.com/amondbymond/amond-frontend.git"
echo "Backend:  https://github.com/amondbymond/amond-backend.git"