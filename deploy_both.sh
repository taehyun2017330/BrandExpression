#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Amond Deployment Script${NC}"
echo -e "${YELLOW}=========================${NC}"
echo ""

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Function to handle errors
handle_error() {
    echo -e "${RED}❌ Error: $1${NC}"
    exit 1
}

# Function to show what will be pushed
show_changes() {
    local repo_name=$1
    local repo_path=$2
    
    echo -e "${YELLOW}📋 Changes in $repo_name:${NC}"
    cd "$repo_path" || handle_error "Cannot access $repo_name directory"
    
    # Check if there are any changes
    if [[ -z $(git status -s) ]]; then
        echo "No changes to commit"
    else
        git status -s
    fi
    
    # Show unpushed commits
    local unpushed=$(git log origin/main..HEAD --oneline 2>/dev/null)
    if [[ -n $unpushed ]]; then
        echo -e "\n${YELLOW}Unpushed commits:${NC}"
        echo "$unpushed"
    fi
    
    echo ""
}

# Deploy Frontend
deploy_frontend() {
    echo -e "${GREEN}🎨 Deploying Frontend...${NC}"
    echo -e "${GREEN}========================${NC}"
    
    cd "$SCRIPT_DIR/amond-frontend" || handle_error "Cannot access frontend directory"
    
    # Show current branch
    current_branch=$(git branch --show-current)
    echo "Current branch: $current_branch"
    
    # Show changes
    show_changes "Frontend" "$SCRIPT_DIR/amond-frontend"
    
    # Ask for confirmation
    read -p "Do you want to commit and push frontend changes? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Add all changes
        git add .
        
        # Commit with message
        read -p "Enter commit message for frontend: " commit_msg
        git commit -m "$commit_msg" || echo "No changes to commit"
        
        # Push to remote
        echo "Pushing to https://github.com/amondbymond/amond-frontend.git..."
        git push origin main || handle_error "Failed to push frontend"
        
        echo -e "${GREEN}✅ Frontend deployed successfully!${NC}"
    else
        echo "Skipping frontend deployment"
    fi
    
    echo ""
}

# Deploy Backend
deploy_backend() {
    echo -e "${GREEN}⚙️  Deploying Backend...${NC}"
    echo -e "${GREEN}=======================${NC}"
    
    cd "$SCRIPT_DIR/amond-backend" || handle_error "Cannot access backend directory"
    
    # Show current branch
    current_branch=$(git branch --show-current)
    echo "Current branch: $current_branch"
    
    # Show changes
    show_changes "Backend" "$SCRIPT_DIR/amond-backend"
    
    # Ask for confirmation
    read -p "Do you want to commit and push backend changes? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Add all changes
        git add .
        
        # Commit with message
        read -p "Enter commit message for backend: " commit_msg
        git commit -m "$commit_msg" || echo "No changes to commit"
        
        # Push to remote
        echo "Pushing to https://github.com/amondbymond/amond-backend.git..."
        git push origin main || handle_error "Failed to push backend"
        
        echo -e "${GREEN}✅ Backend deployed successfully!${NC}"
    else
        echo "Skipping backend deployment"
    fi
    
    echo ""
}

# Main execution
main() {
    echo "This script will deploy both frontend and backend to their respective GitHub repositories."
    echo ""
    echo "Frontend: https://github.com/amondbymond/amond-frontend.git"
    echo "Backend:  https://github.com/amondbymond/amond-backend.git"
    echo ""
    
    # Check if we're in the correct directory
    if [[ ! -d "$SCRIPT_DIR/amond-frontend" ]] || [[ ! -d "$SCRIPT_DIR/amond-backend" ]]; then
        handle_error "Cannot find amond-frontend or amond-backend directories. Make sure you're in the Amond_separated directory."
    fi
    
    # Deploy both
    deploy_frontend
    deploy_backend
    
    echo -e "${GREEN}🎉 Deployment process completed!${NC}"
    echo ""
    echo "Note: Frontend will be automatically built and deployed by AWS Amplify."
    echo "Note: Remember to deploy backend to your server if needed."
}

# Run main function
main