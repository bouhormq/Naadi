#!/bin/bash

# Set colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}==================================${NC}"
echo -e "${YELLOW}  Naadi API Endpoint Tests Runner ${NC}"
echo -e "${YELLOW}==================================${NC}"

# Run partner app tests
echo -e "\n${YELLOW}Running Partner App Tests...${NC}"
cd "$(dirname "$0")/../../naadi-partner" || exit
node tests/run-all-tests.js
BUSINESS_TESTS_RESULT=$?

# Run user app tests
echo -e "\n${YELLOW}Running User App Tests...${NC}"
cd "$(dirname "$0")/../../naadi-user" || exit
node tests/run-all-tests.js
USER_TESTS_RESULT=$?

# Check results
echo -e "\n${YELLOW}==================================${NC}"
echo -e "${YELLOW}          Test Summary            ${NC}"
echo -e "${YELLOW}==================================${NC}"

if [ $BUSINESS_TESTS_RESULT -eq 0 ]; then
  echo -e "${GREEN}✓ Partner App Tests: PASSED${NC}"
else
  echo -e "${RED}✗ Partner App Tests: FAILED${NC}"
fi

if [ $USER_TESTS_RESULT -eq 0 ]; then
  echo -e "${GREEN}✓ User App Tests: PASSED${NC}"
else
  echo -e "${RED}✗ User App Tests: FAILED${NC}"
fi

# Return combined exit code
if [ $BUSINESS_TESTS_RESULT -eq 0 ] && [ $USER_TESTS_RESULT -eq 0 ]; then
  echo -e "\n${GREEN}All endpoint tests passed successfully!${NC}"
  exit 0
else
  echo -e "\n${RED}Some tests failed. See above for details.${NC}"
  exit 1
fi 