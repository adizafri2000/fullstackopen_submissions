#!/usr/bin/env sh

# Move to frontend dir and build frontend project
cd frontend
npm install
npm run build

# Copy dist folder to backend directory
cp dist ../backend

# Change to backend dir
cd ../backend

# Build backend project
npm install

