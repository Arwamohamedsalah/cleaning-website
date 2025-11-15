#!/bin/bash

# ============================================
# Quick Deploy Script for VPS
# Domain: ardbk.com
# VPS IP: 72.61.94.71
# ============================================

set -e

DOMAIN="ardbk.com"
GITHUB_REPO="https://github.com/Arwamohamedsalah/cleaning-website.git"

echo "🚀 Starting Quick Deployment..."

# Update system
apt-get update -y

# Install dependencies
echo "📦 Installing dependencies..."
apt-get install -y git curl

# Install Node.js 18
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js 18..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
fi

# Install PM2
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    npm install -g pm2
fi

# Install Nginx
if ! command -v nginx &> /dev/null; then
    echo "📦 Installing Nginx..."
    apt-get install -y nginx
fi

# Clone or update repository
echo "📥 Cloning/Updating repository..."
mkdir -p /var/www
cd /var/www
if [ -d "cleaning" ]; then
    echo "📝 Repository exists, updating..."
    cd cleaning
    git pull origin main
else
    echo "📥 Cloning repository..."
    git clone $GITHUB_REPO cleaning
    cd cleaning
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install --production

# Create .env if not exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp HOSTINGER_ENV.txt .env
    echo ""
    echo "⚠️  ⚠️  ⚠️  IMPORTANT ⚠️  ⚠️  ⚠️"
    echo "Please edit /var/www/cleaning/backend/.env with your actual values:"
    echo "  - MONGODB_URI"
    echo "  - JWT_SECRET"
    echo "  - FRONTEND_URL=https://ardbk.com"
    echo "  - PORT=3000"
    echo "  - NODE_ENV=production"
    echo ""
    read -p "Press Enter after editing .env file..."
fi

# Build frontend
echo "🏗️  Building frontend..."
cd /var/www/cleaning
npm install --production
npm run build

# Move frontend
echo "📁 Moving frontend build..."
mkdir -p /var/www/client
rm -rf /var/www/client/*
cp -r dist/* /var/www/client/
chown -R www-data:www-data /var/www/client
chmod -R 755 /var/www/client

# Configure Nginx
echo "⚙️  Configuring Nginx..."
cat > /etc/nginx/sites-available/$DOMAIN << 'NGINX_EOF'
server {
    listen 80;
    listen [::]:80;
    server_name ardbk.com www.ardbk.com;

    root /var/www/client;
    index index.html;

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
NGINX_EOF

# Enable site
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and restart Nginx
nginx -t
systemctl restart nginx

# Start backend with PM2
echo "🚀 Starting backend with PM2..."
cd /var/www/cleaning/backend
pm2 delete cleaning-backend 2>/dev/null || true
pm2 start server.js --name cleaning-backend --env production
pm2 save
pm2 startup systemd -u root --hp /root | grep "sudo" | bash || true

# Install Certbot and get SSL
echo "🔐 Setting up SSL..."
if ! command -v certbot &> /dev/null; then
    apt-get install -y certbot python3-certbot-nginx
fi

certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN --redirect || {
    echo "⚠️  SSL setup may require manual intervention"
}

echo ""
echo "✅ Deployment Complete!"
echo "🌐 Visit: https://$DOMAIN"
echo "📊 PM2 Status:"
pm2 status

