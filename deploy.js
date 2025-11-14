#!/usr/bin/env node

/**
 * Deployment Script for Hostinger
 * 
 * Usage:
 *   node deploy.js
 * 
 * This script will:
 * 1. Build the frontend
 * 2. Upload files to Hostinger via SFTP
 * 3. Restart the Node.js app
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function exec(command, options = {}) {
  try {
    return execSync(command, { 
      stdio: 'inherit', 
      encoding: 'utf8',
      ...options 
    });
  } catch (error) {
    log(`Error executing: ${command}`, 'red');
    process.exit(1);
  }
}

// Load deployment config
let deployConfig = {};
const configPath = path.join(__dirname, 'deploy.config.json');

if (fs.existsSync(configPath)) {
  deployConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} else {
  log('⚠️  deploy.config.json not found. Creating template...', 'yellow');
  const template = {
    hostinger: {
      host: 'your-hostinger-host.com',
      username: 'your-username',
      password: 'your-password',
      deployPath: '/home/username/public_html',
      sshKey: '/path/to/ssh/key' // Optional
    }
  };
  fs.writeFileSync(configPath, JSON.stringify(template, null, 2));
  log('✅ Created deploy.config.json. Please fill in your Hostinger credentials.', 'green');
  log('⚠️  Then run: node deploy.js', 'yellow');
  process.exit(0);
}

async function deploy() {
  log('\n🚀 Starting deployment to Hostinger...\n', 'blue');

  // Step 1: Build Frontend
  log('📦 Step 1: Building Frontend...', 'yellow');
  exec('npm run build');
  log('✅ Frontend built successfully\n', 'green');

  // Step 2: Install dependencies (if needed)
  log('📦 Step 2: Installing dependencies...', 'yellow');
  exec('npm install --production');
  exec('cd backend && npm install --production');
  log('✅ Dependencies installed\n', 'green');

  // Step 3: Upload to Hostinger
  log('📤 Step 3: Uploading files to Hostinger...', 'yellow');
  
  // Check if lftp is available (for SFTP)
  try {
    execSync('which lftp', { stdio: 'ignore' });
    
    const lftpScript = `
set sftp:auto-confirm yes
set sftp:connect-program "ssh -a -x -oStrictHostKeyChecking=no"
open sftp://${deployConfig.hostinger.username}:${deployConfig.hostinger.password}@${deployConfig.hostinger.host}
cd ${deployConfig.hostinger.deployPath}
mirror -R --exclude-glob=".git*" --exclude-glob="node_modules" --exclude-glob=".env" --exclude-glob="dist" --exclude-glob=".vscode" --exclude-glob=".idea" --exclude-glob="*.log" --exclude-glob="backend/node_modules" --exclude-glob="backend/whatsapp-session" . .
put -O ${deployConfig.hostinger.deployPath} dist/index.html
put -O ${deployConfig.hostinger.deployPath}/dist dist/assets
bye
`;
    
    fs.writeFileSync('/tmp/lftp-script.txt', lftpScript);
    exec(`lftp -f /tmp/lftp-script.txt`);
    fs.unlinkSync('/tmp/lftp-script.txt');
    
  } catch (error) {
    log('⚠️  lftp not found. Using alternative method...', 'yellow');
    log('💡 Install lftp: sudo apt-get install lftp (Linux) or brew install lftp (Mac)', 'yellow');
    log('💡 Or use GitHub Actions for automatic deployment', 'yellow');
  }

  log('✅ Files uploaded successfully\n', 'green');

  // Step 4: Build on server (via SSH if available)
  if (deployConfig.hostinger.sshKey && fs.existsSync(deployConfig.hostinger.sshKey)) {
    log('🔄 Step 4: Building on server...', 'yellow');
    const sshCommand = `
      cd ${deployConfig.hostinger.deployPath} && 
      npm install --production && 
      cd backend && 
      npm install --production && 
      cd .. && 
      npm run build && 
      pm2 restart cleaning-service || echo "PM2 not found, restart manually"
    `;
    
    try {
      exec(`ssh -i ${deployConfig.hostinger.sshKey} ${deployConfig.hostinger.username}@${deployConfig.hostinger.host} "${sshCommand}"`);
      log('✅ Server build completed\n', 'green');
    } catch (error) {
      log('⚠️  SSH connection failed. Please build manually on server.', 'yellow');
    }
  } else {
    log('⚠️  SSH key not configured. Please build manually on server:', 'yellow');
    log('   cd ' + deployConfig.hostinger.deployPath, 'blue');
    log('   npm install --production', 'blue');
    log('   cd backend && npm install --production && cd ..', 'blue');
    log('   npm run build', 'blue');
    log('   pm2 restart cleaning-service', 'blue');
  }

  log('🎉 Deployment completed!', 'green');
  log('🌐 Visit: https://ardbk.com', 'blue');
}

deploy().catch(error => {
  log(`❌ Deployment failed: ${error.message}`, 'red');
  process.exit(1);
});

