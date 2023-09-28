#!/usr/bin/env sh

# Move to frontend dir and build frontend project
cd frontend
npm install
echo "Building frontend ..."
npm run build

# Copy dist folder to backend directory
echo "Copying frontend dist folder to backend ..."
cp -r dist ../backend

# Change to backend dir
cd ../backend

# Build backend project
pwd
echo "Building backend ..."
npm install

