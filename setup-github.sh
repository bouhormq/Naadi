#!/bin/bash

# Exit on error
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

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

# Instructions for connecting to GitHub
echo -e "\n${GREEN}=== Next Steps ===${NC}"
echo -e "${YELLOW}1. Create a new repository on GitHub:${NC}"
echo -e "   ${GREEN}https://github.com/new${NC}"
echo -e "${YELLOW}2. Connect your local repository to GitHub:${NC}"
echo -e "   ${GREEN}git remote add origin https://github.com/yourusername/naadi.git${NC}"
echo -e "${YELLOW}3. Push your code to GitHub:${NC}"
echo -e "   ${GREEN}git push -u origin main${NC} or ${GREEN}git push -u origin master${NC} (depending on your default branch name)"
echo -e "\n${GREEN}Remember to replace 'yourusername' with your actual GitHub username.${NC}" 