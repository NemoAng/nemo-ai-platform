#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$HOME/nemo-ai-platform"
FRONTEND_DIR="$PROJECT_DIR/frontend"
DEPLOY_DIR="/var/www/nemo-ai-platform"

cd "$FRONTEND_DIR"

npm run build

sudo mkdir -p "$DEPLOY_DIR"
sudo rm -rf "$DEPLOY_DIR"/*
sudo cp -r dist/* "$DEPLOY_DIR"/

sudo nginx -t
sudo systemctl reload nginx

echo "Frontend deployed to https://www.nemowang.dpdns.org/ai/"
