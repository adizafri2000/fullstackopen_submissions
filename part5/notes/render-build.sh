#!/usr/bin/env sh

# Move to frontend dir and build frontend project
cd frontend
echo "(1/3) Building frontend ..."
npm install
npm run build

# Copy dist folder to backend directory
echo "(2/3) Copying frontend dist folder to backend ..."
cp -r dist ../backend

# Change to backend dir
cd ../backend

# Build backend project
pwd
echo "(3/3) Building backend ..."
npm install

echo "render build script execution complete"

