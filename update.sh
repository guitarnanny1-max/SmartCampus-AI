#!/bin/bash
set -e

echo "=========================================="
echo "Updating SmartCampus AI (www.smartcampusai.in)"
echo "=========================================="

git status
git add .
git commit -m "feat: update SmartCampus AI webpage content and UI"
git push origin main

echo "=========================================="
echo "Success! Changes pushed to GitHub."
echo "Vercel is now building and deploying your update live."
echo "=========================================="
