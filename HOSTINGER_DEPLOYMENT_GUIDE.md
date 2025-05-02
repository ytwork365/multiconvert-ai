# MultiConvert AI - Hostinger VPS Deployment Guide

This guide covers the process of deploying MultiConvert AI to a Hostinger VPS.

## Prerequisites

- A Hostinger VPS with SSH access
- Node.js (v16+) installed on your VPS
- PostgreSQL database set up on your VPS or using external service
- nginx or Apache for serving the application
- Domain name configured to point to your VPS (optional but recommended)

## Deployment Steps

### 1. Prepare Your VPS

```bash
# Update packages
sudo apt update
sudo apt upgrade -y

# Install essential tools
sudo apt install -y git curl build-essential

# Install Node.js if not already installed
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2
```

### 2. Set Up PostgreSQL (if not using external service)

```bash
# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Access PostgreSQL CLI
sudo -u postgres psql

# In the PostgreSQL CLI, create database and user
CREATE DATABASE multiconvertai;
CREATE USER multiconvertuser WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE multiconvertai TO multiconvertuser;
\q
```

### 3. Clone and Set Up the Project

```bash
# Clone your project repository
git clone https://github.com/yourusername/multiconvert-ai.git
cd multiconvert-ai

# Install dependencies
npm install

# Create .env file
cat > .env << EOL
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://multiconvertuser:your_secure_password@localhost:5432/multiconvertai
OPENAI_API_KEY=your_openai_api_key
EOL
```

### 4. Build the Application

```bash
# Build the client
npm run build

# Push database schema (if using PostgreSQL)
npm run db:push
```

### 5. Set Up PM2 for Process Management

```bash
# Start the application with PM2
pm2 start server.js --name multiconvert-ai

# Make sure it starts on system reboot
pm2 startup
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u your_user --hp /home/your_user
pm2 save
```

### 6. Configure nginx as Reverse Proxy

```bash
# Install nginx if not already installed
sudo apt install -y nginx

# Create nginx configuration file
sudo nano /etc/nginx/sites-available/multiconvert-ai
```

Add the following configuration (already customized for your VPS IP: 168.231.82.38):

```nginx
server {
    listen 80;
    server_name 168.231.82.38 yourdomain.com www.yourdomain.com;
    # IP address included for direct access
    
    # For domain names, redirect HTTP to HTTPS
    # For IP address, serve content directly over HTTP until SSL is set up
    location / {
        # If accessing via domain name
        if ($host ~ (yourdomain\.com|www\.yourdomain\.com)) {
            return 301 https://$host$request_uri;
        }
        
        # If accessing via IP address, proxy to the application
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Then enable the site and restart nginx:

```bash
sudo ln -s /etc/nginx/sites-available/multiconvert-ai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 7. Set Up SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain and install SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Verify auto-renewal is set up
sudo systemctl status certbot.timer
```

## Maintenance and Updates

### Updating Your Application

```bash
# Pull latest changes
cd /path/to/multiconvert-ai
git pull

# Install dependencies (if changed)
npm install

# Rebuild the application
npm run build

# Apply database migrations (if any)
npm run db:push

# Restart the application
pm2 restart multiconvert-ai
```

### Monitoring Your Application

```bash
# View logs
pm2 logs multiconvert-ai

# View status
pm2 status

# Monitor in real-time
pm2 monit
```

## Database Backups

Set up a cron job to periodically back up your PostgreSQL database:

```bash
sudo nano /etc/cron.daily/backup-multiconvertai
```

Add the following content:

```bash
#!/bin/bash
BACKUP_DIR=/home/your_user/backups
FILENAME="multiconvertai_$(date +%Y%m%d_%H%M%S).sql"
mkdir -p $BACKUP_DIR
pg_dump -U multiconvertuser -h localhost multiconvertai > $BACKUP_DIR/$FILENAME
gzip $BACKUP_DIR/$FILENAME
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete
```

Make the script executable:

```bash
sudo chmod +x /etc/cron.daily/backup-multiconvertai
```

## Troubleshooting

### Application Not Starting

Check the PM2 logs:

```bash
pm2 logs multiconvert-ai
```

### Database Connection Issues

Verify your PostgreSQL service is running:

```bash
sudo systemctl status postgresql
```

Check your database connection settings in the `.env` file.

### nginx Issues

Check nginx configuration for syntax errors:

```bash
sudo nginx -t
```

Check nginx error logs:

```bash
sudo cat /var/log/nginx/error.log
```

## Support

If you encounter issues not covered by this guide, refer to:

- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Hostinger VPS Documentation](https://www.hostinger.com/tutorials/vps/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [nginx Documentation](https://nginx.org/en/docs/)
