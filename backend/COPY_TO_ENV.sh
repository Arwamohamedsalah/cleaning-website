#!/bin/bash

# Script لنسخ ملف .env للإنتاج
# استخدم: bash COPY_TO_ENV.sh

echo "📝 Creating .env file from template..."

# نسخ من HOSTINGER_ENV.txt
if [ -f "HOSTINGER_ENV.txt" ]; then
    cp HOSTINGER_ENV.txt .env
    echo "✅ .env file created from HOSTINGER_ENV.txt"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env file and update:"
    echo "   - MONGODB_URI"
    echo "   - JWT_SECRET"
    echo "   - ADMIN_PASSWORD"
    echo ""
    echo "Then run: pm2 restart cleaning-backend"
else
    echo "❌ HOSTINGER_ENV.txt not found!"
    exit 1
fi

