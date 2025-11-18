#!/bin/bash

# 🔧 Script to fix mongoose error on server
# Run this on the VPS: /var/www/cleaning

echo "🔧 Fixing mongoose error..."

# Navigate to backend directory
cd /var/www/cleaning/backend || exit 1

# Stop PM2 process
echo "⏸️ Stopping PM2 process..."
pm2 stop cleaning-backend || true
pm2 delete cleaning-backend || true

# Remove node_modules and package-lock.json
echo "🗑️ Removing old dependencies..."
rm -rf node_modules package-lock.json

# Clear npm cache
echo "🧹 Clearing npm cache..."
npm cache clean --force

# Reinstall all dependencies
echo "📦 Installing dependencies..."
npm install

# Verify mongoose installation
echo "✅ Verifying mongoose installation..."
if npm list mongoose > /dev/null 2>&1; then
    echo "✅ mongoose is installed"
    npm list mongoose
else
    echo "❌ mongoose is NOT installed"
    echo "Installing mongoose specifically..."
    npm install mongoose@^8.0.3
fi

# Check Node.js version
echo "📋 Node.js version:"
node --version

# Check if package.json has "type": "module"
echo "📋 Checking package.json..."
if grep -q '"type": "module"' package.json; then
    echo "✅ package.json has 'type: module'"
else
    echo "❌ package.json is missing 'type: module'"
    echo "This might be the issue!"
fi

# Start PM2 process
echo "🚀 Starting PM2 process..."
cd /var/www/cleaning
pm2 start pm2-ecosystem.config.js || pm2 start backend/server.js --name cleaning-backend --env production

# Save PM2 configuration
pm2 save

# Show logs
echo "📋 Showing last 20 lines of logs..."
pm2 logs cleaning-backend --lines 20 --nostream

echo "✅ Done! Check the logs above for any errors."

