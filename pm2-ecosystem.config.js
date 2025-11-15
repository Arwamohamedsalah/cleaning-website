// PM2 Ecosystem Configuration
// Run: pm2 start ecosystem.config.js

module.exports = {
  apps: [{
    name: 'cleaning-backend',
    script: './backend/server.js',
    cwd: '/var/www/cleaning',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/cleaning-backend-error.log',
    out_file: '/var/log/pm2/cleaning-backend-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    watch: false,
    max_memory_restart: '1G'
  }]
};

