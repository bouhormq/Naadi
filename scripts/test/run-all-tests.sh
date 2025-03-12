#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "\n${BLUE}========================================${NC}"
echo -e "${BLUE}    RUNNING ALL PACKAGE TESTS${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Function to run tests with proper formatting
run_test() {
  local package=$1
  local test_cmd=$2
  
  echo -e "${YELLOW}Running tests for ${package}...${NC}"
  echo -e "${BLUE}----------------------------------------${NC}"
  
  if npm run $test_cmd; then
    echo -e "\n${GREEN}✅ ${package} tests PASSED${NC}\n"
    return 0
  else
    echo -e "\n${RED}❌ ${package} tests FAILED${NC}\n"
    return 1
  fi
}

# Track failures
FAILURES=0

# Run API tests
run_test "@naadi/api" "test:api" || ((FAILURES++))

# Add more package tests here when they're available
# For example:
# run_test "@naadi/types" "test:types" || ((FAILURES++))

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}           TEST SUMMARY${NC}"
echo -e "${BLUE}========================================${NC}\n"

if [ $FAILURES -eq 0 ]; then
  echo -e "${GREEN}🎉 ALL TESTS PASSED! 🎉${NC}\n"
  exit 0
else
  echo -e "${RED}❌ TESTS FAILED: $FAILURES package(s) had failures${NC}\n"
  exit 1
fi
