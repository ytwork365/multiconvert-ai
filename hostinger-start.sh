#!/bin/bash

set -e

echo "=== MultiConvert AI Server Starting ==="

# Set default port if not provided
export PORT=${PORT:-3000}
echo "Using port: $PORT"

# Create uploads directory if it doesn't exist
if [ ! -d "uploads" ]; then
  echo "Creating uploads directory..."
  mkdir -p uploads
  chmod 777 uploads
fi

# Check if the dist directory exists
if [ ! -d "dist" ]; then
  echo "ERROR: dist directory not found. Build may have failed."
  echo "Please run './hostinger-build.sh' first."
  exit 1
fi

# Check if the server file exists
if [ ! -f "dist/index.js" ]; then
  echo "ERROR: Server file (dist/index.js) not found. Build may have failed."
  echo "Please run './hostinger-build.sh' first."
  exit 1
fi

# Check if the client build exists
if [ ! -d "dist/public" ]; then
  echo "ERROR: Client build (dist/public) not found. Build may have failed."
  echo "Please run './hostinger-build.sh' first."
  exit 1
fi

echo "Starting server on port $PORT..."

# Run with Node.js directly (for testing)
# For production, use PM2 as described in HOSTINGER_DEPLOYMENT_GUIDE.md
node dist/index.js
