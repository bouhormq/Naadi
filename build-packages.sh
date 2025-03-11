#!/bin/bash

# Exit on error
set -e

echo "Building Naadi packages..."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing root dependencies..."
  npm install
fi

# Build types package
echo "Building @naadi/types..."
cd packages/types
if [ ! -d "node_modules" ]; then
  npm install
fi
npm run build
cd ../..

# Build API package
echo "Building @naadi/api..."
cd packages/api
if [ ! -d "node_modules" ]; then
  npm install
fi
npm run build
cd ../..

echo "All packages built successfully!"
echo ""
echo "You can now use the packages in your application."
echo "If you encounter any issues, try running 'npm install' in the root directory." 