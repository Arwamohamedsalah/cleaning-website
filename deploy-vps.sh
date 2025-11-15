#!/bin/bash

# ============================================
# VPS Deployment Script for Hostinger
# Domain: ardbk.com
# VPS IP: 72.61.94.71
# ============================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
VPS_IP="72.61.94.71"
VPS_USER="root"  # Change if different
DOMAIN="ardbk.com"
GITHUB_REPO="https://github.com/Arwamohamedsalah/cleaning-.git"
DEPLOY_PATH="/var/www"
BACKEND_PATH="$DEPLOY_PATH/cleaning"
FRONTEND_PATH="$DEPLOY_PATH/client"
NGINX_CONFIG="/etc/nginx/sites-available/$DOMAIN"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Starting VPS Deployment${NC}"
echo -e "${GREEN}========================================${NC}"

# Step 1: Check Git installation
echo -e "\n${YELLOW}Step 1: Checking Git installation...${NC}"
if ! command -v git &> /dev/null; then
    echo -e "${YELLOW}Git not found. Installing Git...${NC}"
    apt-get update
    apt-get install -y git
else
    echo -e "${GREEN}✓ Git is installed${NC}"
fi

# Step 2: Clone repository
echo -e "\n${YELLOW}Step 2: Cloning repository...${NC}"
if [ -d "$BACKEND_PATH" ]; then
    echo -e "${YELLOW}Repository exists. Updating...${NC}"
    cd "$BACKEND_PATH"
    git pull origin main
else
    echo -e "${YELLOW}Cloning repository...${NC}"
    mkdir -p "$DEPLOY_PATH"
    cd "$DEPLOY_PATH"
    git clone "$GITHUB_REPO" cleaning
fi
echo -e "${GREEN}✓ Repository cloned/updated${NC}"

# Step 3: Install Node.js if not installed
echo -e "\n${YELLOW}Step 3: Checking Node.js installation...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Node.js not found. Installing Node.js 18...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
else
    echo -e "${GREEN}✓ Node.js is installed ($(node --version))${NC}"
fi

# Step 4: Install PM2 if not installed
echo -e "\n${YELLOW}Step 4: Checking PM2 installation...${NC}"
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}PM2 not found. Installing PM2...${NC}"
    npm install -g pm2
else
    echo -e "${GREEN}✓ PM2 is installed${NC}"
fi

# Step 5: Install backend dependencies
echo -e "\n${YELLOW}Step 5: Installing backend dependencies...${NC}"
cd "$BACKEND_PATH/backend"
npm install --production
echo -e "${GREEN}✓ Backend dependencies installed${NC}"

# Step 6: Create .env file if it doesn't exist
echo -e "\n${YELLOW}Step 6: Setting up environment variables...${NC}"
if [ ! -f "$BACKEND_PATH/backend/.env" ]; then
    echo -e "${YELLOW}Creating .env file from template...${NC}"
    cp "$BACKEND_PATH/backend/HOSTINGER_ENV.txt" "$BACKEND_PATH/backend/.env"
    echo -e "${RED}⚠ IMPORTANT: Please edit $BACKEND_PATH/backend/.env with your actual values!${NC}"
else
    echo -e "${GREEN}✓ .env file exists${NC}"
fi

# Step 7: Build frontend
echo -e "\n${YELLOW}Step 7: Building frontend...${NC}"
cd "$BACKEND_PATH"
npm install --production
npm run build
echo -e "${GREEN}✓ Frontend built${NC}"

# Step 8: Move frontend build to /var/www/client
echo -e "\n${YELLOW}Step 8: Moving frontend build...${NC}"
mkdir -p "$FRONTEND_PATH"
rm -rf "$FRONTEND_PATH"/*
cp -r "$BACKEND_PATH/dist"/* "$FRONTEND_PATH/"
echo -e "${GREEN}✓ Frontend moved to $FRONTEND_PATH${NC}"

# Step 9: Install Nginx if not installed
echo -e "\n${YELLOW}Step 9: Checking Nginx installation...${NC}"
if ! command -v nginx &> /dev/null; then
    echo -e "${YELLOW}Nginx not found. Installing Nginx...${NC}"
    apt-get update
    apt-get install -y nginx
else
    echo -e "${GREEN}✓ Nginx is installed${NC}"
fi

# Step 10: Configure Nginx
echo -e "\n${YELLOW}Step 10: Configuring Nginx...${NC}"
cat > "$NGINX_CONFIG" << EOF
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;

    # Frontend
    root $FRONTEND_PATH;
    index index.html;

    # API Proxy
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # React Router - serve index.html for all routes
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Static assets caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Enable site
ln -sf "$NGINX_CONFIG" "/etc/nginx/sites-enabled/$DOMAIN"
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
echo -e "\n${YELLOW}Testing Nginx configuration...${NC}"
nginx -t

# Reload Nginx
systemctl reload nginx
echo -e "${GREEN}✓ Nginx configured and reloaded${NC}"

# Step 11: Start backend with PM2
echo -e "\n${YELLOW}Step 11: Starting backend with PM2...${NC}"
cd "$BACKEND_PATH/backend"
pm2 delete cleaning-backend 2>/dev/null || true
pm2 start server.js --name cleaning-backend --env production
pm2 save
pm2 startup systemd -u $VPS_USER --hp /root
echo -e "${GREEN}✓ Backend started with PM2${NC}"

# Step 12: Install Certbot and enable HTTPS
echo -e "\n${YELLOW}Step 12: Setting up HTTPS with Let's Encrypt...${NC}"
if ! command -v certbot &> /dev/null; then
    echo -e "${YELLOW}Installing Certbot...${NC}"
    apt-get update
    apt-get install -y certbot python3-certbot-nginx
fi

echo -e "${YELLOW}Obtaining SSL certificate...${NC}"
certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN --redirect

echo -e "${GREEN}✓ HTTPS configured${NC}"

# Step 13: Final verification
echo -e "\n${YELLOW}Step 13: Verifying deployment...${NC}"
sleep 2

# Check backend
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend is running${NC}"
else
    echo -e "${RED}✗ Backend health check failed${NC}"
fi

# Check Nginx
if systemctl is-active --quiet nginx; then
    echo -e "${GREEN}✓ Nginx is running${NC}"
else
    echo -e "${RED}✗ Nginx is not running${NC}"
fi

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "Frontend: https://$DOMAIN"
echo -e "Backend API: https://$DOMAIN/api"
echo -e "Health Check: https://$DOMAIN/api/health"
echo -e "\n${YELLOW}⚠ Don't forget to:${NC}"
echo -e "1. Edit $BACKEND_PATH/backend/.env with your MongoDB URI and other settings"
echo -e "2. Restart PM2: pm2 restart cleaning-backend"

