#!/bin/bash

# Exit on error
set -e

echo "Building Naadi packages..."

# Install root dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Build types package first since API depends on it
echo "Building @naadi/types..."
npm run build:types

# Build API package
echo "Building @naadi/api..."
npm run build:api

echo "All packages built successfully!"
echo "Workspace links are automatically managed by npm workspaces."
echo "You can use direct imports like: import { signup } from '@naadi/api';" 