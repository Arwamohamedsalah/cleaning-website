#!/bin/bash

# Quick VPS Deployment Script
# Run this script on the VPS after SSH connection

set -e

VPS_IP="72.61.94.71"
DOMAIN="ardbk.com"
GITHUB_REPO="https://github.com/Arwamohamedsalah/cleaning-.git"

echo "🚀 Starting Quick Deployment..."

# Update system
apt-get update -y

# Install Git
apt-get install -y git

# Install Node.js 18
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
fi

# Install PM2
npm install -g pm2

# Install Nginx
apt-get install -y nginx

# Clone/Update repository
cd /var/www
if [ -d "cleaning" ]; then
    cd cleaning && git pull origin main
else
    git clone $GITHUB_REPO cleaning
fi

# Install backend dependencies
cd /var/www/cleaning/backend
npm install --production

# Create .env if not exists
if [ ! -f ".env" ]; then
    cp HOSTINGER_ENV.txt .env
    echo "⚠️  Please edit .env file with your actual values!"
fi

# Build frontend
cd /var/www/cleaning
npm install --production
npm run build

# Move frontend
mkdir -p /var/www/client
rm -rf /var/www/client/*
cp -r dist/* /var/www/client/

# Configure Nginx
cat > /etc/nginx/sites-available/$DOMAIN << 'EOF'
server {
    listen 80;
    server_name ardbk.com www.ardbk.com;
    root /var/www/client;
    index index.html;

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx

# Start backend with PM2
cd /var/www/cleaning/backend
pm2 delete cleaning-backend 2>/dev/null || true
pm2 start server.js --name cleaning-backend --env production
pm2 save
pm2 startup systemd -u root --hp /root

# Install Certbot and get SSL
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN --redirect

echo "✅ Deployment Complete!"
echo "🌐 Visit: https://$DOMAIN"

