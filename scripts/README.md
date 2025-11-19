# Scripts Directory

This directory contains utility scripts for repository management.

## create-stage3-branch.sh

This script creates and pushes the `stage3-design-mockups` branch to GitHub.

### Usage

```bash
# From the repository root
./scripts/create-stage3-branch.sh
```

### What it does

1. Fetches the latest changes from origin
2. Creates the `stage3-design-mockups` branch from `origin/main` (if it doesn't exist locally)
3. Pushes the branch to GitHub

### Requirements

- Git must be installed
- You must have push access to the Halina2Pichukha/ToDoApp repository
- You must be authenticated with GitHub (via SSH keys or HTTPS credentials)

### Branch Information

- **Branch Name**: `stage3-design-mockups`
- **Base Branch**: `main`
- **Purpose**: Stage 3 development for design mockups

After running this script, the branch will be available at:
https://github.com/Halina2Pichukha/ToDoApp/tree/stage3-design-mockups
