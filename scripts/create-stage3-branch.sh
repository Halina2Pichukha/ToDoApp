#!/bin/bash
# Script to push the stage3-design-mockups branch to GitHub remote
# 
# This script should be run by someone with push access to the repository

set -e

echo "==============================================="
echo "Pushing stage3-design-mockups branch to GitHub"
echo "==============================================="

# Ensure the main branch is up to date
echo "Fetching latest changes..."
git fetch origin

# Create the branch from main if it doesn't exist
if git show-ref --verify --quiet refs/heads/stage3-design-mockups; then
    echo "Branch stage3-design-mockups already exists locally"
else
    echo "Creating stage3-design-mockups branch from main..."
    git branch stage3-design-mockups origin/main
fi

# Push the branch to remote
echo "Pushing stage3-design-mockups to origin..."
git push origin stage3-design-mockups

echo ""
echo "✓ Successfully pushed stage3-design-mockups branch!"
echo "✓ Branch is now available at: https://github.com/Halina2Pichukha/ToDoApp/tree/stage3-design-mockups"
echo ""
