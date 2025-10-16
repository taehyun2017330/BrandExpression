#!/bin/bash

echo "
========================================
🚀 INICIS 빌링 테스트 - Standalone
========================================
"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "
🌟 Starting server...
"

# Start the server
npm start