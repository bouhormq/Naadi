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

echo -e "${GREEN}Setting up Git repository for Naadi...${NC}"

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
else
    echo -e "${YELLOW}Git repository already exists.${NC}"
fi

# Add all files to git
echo -e "${YELLOW}Adding files to Git...${NC}"
git add .

# Initial commit
echo -e "${YELLOW}Creating initial commit...${NC}"
git commit -m "Initial commit: Naadi platform"

# Add remote
echo -e "${YELLOW}Adding remote repository...${NC}"
git remote add origin ${REPO_URL}

# Push to GitHub
echo -e "${YELLOW}Pushing to GitHub...${NC}"
echo -e "${GREEN}Running: git push -u origin main${NC}"
echo -e "${YELLOW}If this fails with an error about the 'main' branch, try:${NC}"
echo -e "${GREEN}git push -u origin master${NC}"

# Instructions for next steps
echo -e "\n${GREEN}=== Next Steps ===${NC}"
echo -e "${YELLOW}1. Push your code to GitHub with one of these commands:${NC}"
echo -e "   ${GREEN}git push -u origin main${NC}"
echo -e "   ${GREEN}git push -u origin master${NC} (depending on your default branch name)"
echo -e "\n${YELLOW}2. Visit your repository:${NC}"
echo -e "   ${GREEN}https://github.com/bouhormq/Naadi${NC}" 