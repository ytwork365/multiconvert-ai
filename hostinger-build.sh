#!/bin/bash

set -e

echo "=== MultiConvert AI Build Script Started ==="

# Install dependencies
echo "Installing dependencies..."
npm install

# Build client
echo "Building client-side code..."
export NODE_ENV=production
npx vite build

# Build server
echo "Building server-side code..."
npx esbuild server/index.ts --platform=node --external:express --external:react --external:react-dom --external:@neondatabase/serverless --external:drizzle-orm --bundle --format=esm --outdir=dist --minify

echo "Build completed successfully."

# Database migrations
if [ -n "$DATABASE_URL" ]; then
  echo "Running database migrations..."
  npm run db:push
  echo "Database migrations completed."
else
  echo "WARNING: DATABASE_URL is not set. Skipping database migrations."
fi

# Set up uploads directory
mkdir -p uploads
chmod 777 uploads
echo "Created uploads directory."

echo "=== Build Script Completed Successfully ==="
