#!/bin/bash

# Exit on error
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# User's repository URL
REPO_URL="https://github.com/bouhormq/Naadi.git"

# Get commit message from command line or use default
if [ $# -eq 0 ]; then
    echo -e "${YELLOW}No commit message provided. Using default message.${NC}"
    COMMIT_MSG="Update Naadi platform"
else
    COMMIT_MSG="$*"
fi

echo -e "${GREEN}Naadi Git Helper${NC}"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}Git is not installed. Please install Git first.${NC}"
    exit 1
fi

# Initialize Git repository if .git directory doesn't exist
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}Initializing Git repository...${NC}"
    git init
    echo -e "${GREEN}Git repository initialized.${NC}"
    
    # Set up remote only if this is a new repo
    echo -e "${YELLOW}Adding remote repository...${NC}"
    git remote add origin ${REPO_URL}
else
    echo -e "${YELLOW}Git repository already exists.${NC}"
    
    # Check if the origin remote exists, add it if not
    if ! git remote get-url origin &>/dev/null; then
        echo -e "${YELLOW}Adding remote repository...${NC}"
        git remote add origin ${REPO_URL}
    fi
fi

# Show status before committing
echo -e "${YELLOW}Current Git status:${NC}"
git status

# Ask for confirmation to continue
read -p "Continue with git add and commit? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}Operation cancelled by user.${NC}"
    exit 0
fi

# Add all files to git
echo -e "${YELLOW}Adding files to Git...${NC}"
git add .

# Commit with provided message
echo -e "${YELLOW}Creating commit with message: ${NC}\"${COMMIT_MSG}\""
git commit -m "$COMMIT_MSG"

# Ask if user wants to push
read -p "Push changes to GitHub now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Try to determine the current branch
    CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
    echo -e "${YELLOW}Pushing to ${CURRENT_BRANCH} branch...${NC}"
    git push -u origin $CURRENT_BRANCH
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Successfully pushed to GitHub!${NC}"
    else
        echo -e "${RED}Push failed. You can try manually with:${NC}"
        echo -e "${GREEN}git push -u origin main${NC} or ${GREEN}git push -u origin master${NC}"
    fi
else
    echo -e "${YELLOW}Changes committed but not pushed. You can push later with:${NC}"
    echo -e "${GREEN}git push origin $(git rev-parse --abbrev-ref HEAD)${NC}"
fi

echo -e "\n${GREEN}== Git Operation Complete ==${NC}"
echo -e "${YELLOW}Visit your repository: ${GREEN}https://github.com/bouhormq/Naadi${NC}" 