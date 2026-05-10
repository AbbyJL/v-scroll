#!/bin/bash
set -e

# Build the project
./build.sh

# Create a temporary directory
TMP_DIR=$(mktemp -d)

# Copy build output to temp directory
cp -r dist/* "$TMP_DIR/"

# Go to temp directory and initialize git
cd "$TMP_DIR"
git init
git add .
git commit -m "Deploy to GitHub Pages"

# Push to gh-pages branch
git remote add origin "https://github.com/$1/$2.git"
git branch -M gh-pages
git push -f origin gh-pages

# Cleanup
cd -
rm -rf "$TMP_DIR"

echo "Deployed to GitHub Pages!"
