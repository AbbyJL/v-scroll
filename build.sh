#!/bin/bash
set -e

echo "Building v-scroll component..."

# Check if bun is available
if command -v bun &> /dev/null; then
  echo "Using bun"
  bun i
  bun run build
else
  echo "Bun not found, falling back to npm"
  npm install
  npm run build
fi

echo "Build completed successfully!"
