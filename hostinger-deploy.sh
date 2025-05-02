#!/bin/bash

# MultiConvert AI - Quick Deploy Script for Hostinger VPS (IP: 168.231.82.38)

set -e

echo "=== MultiConvert AI Deployment Started ==="
echo "Target: Hostinger VPS (IP: 168.231.82.38)"
echo ""

# Check if running as root or with sudo
if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root or with sudo"
   exit 1
fi

# Install required packages
echo "Installing required packages..."
apt update
apt install -y git curl build-essential nginx postgresql postgresql-contrib nodejs npm

# Install PM2 globally
echo "Installing PM2..."
npm install -g pm2

# Create deployment directory
DEPLOY_DIR="/var/www/multiconvert-ai"
echo "Creating deployment directory: $DEPLOY_DIR"
mkdir -p $DEPLOY_DIR

# Clone the repository (replace with your actual repo URL)
echo "Cloning repository..."
if [ -d "$DEPLOY_DIR/.git" ]; then
  echo "Repository already exists. Pulling latest changes..."
  cd $DEPLOY_DIR
  git pull
else
  echo "Fresh clone of repository..."
  git clone https://github.com/yourusername/multiconvert-ai.git $DEPLOY_DIR
  cd $DEPLOY_DIR
fi

# Install dependencies
echo "Installing Node.js dependencies..."
npm install

# Set up .env file if it doesn't exist
if [ ! -f "$DEPLOY_DIR/.env" ]; then
  echo "Creating .env file..."
  cp .env.hostinger.example .env
  echo "Please edit the .env file with your actual configuration values."
  echo "You can do this with: nano $DEPLOY_DIR/.env"
fi

# Set up database
echo "Setting up PostgreSQL database..."
if sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw multiconvertai; then
  echo "Database already exists."
else
  echo "Creating new database..."
  sudo -u postgres psql -c "CREATE DATABASE multiconvertai;"
  sudo -u postgres psql -c "CREATE USER multiconvertuser WITH ENCRYPTED PASSWORD 'change_this_password';"
  sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE multiconvertai TO multiconvertuser;"
  echo "PostgreSQL database created. Remember to update your .env file with these credentials."
fi

# Run build script
echo "Building application..."
chmod +x hostinger-build.sh
./hostinger-build.sh

# Configure nginx
echo "Configuring nginx..."
cp nginx.conf /etc/nginx/sites-available/multiconvert-ai
ln -sf /etc/nginx/sites-available/multiconvert-ai /etc/nginx/sites-enabled/
nginx -t && systemctl restart nginx

# Set up PM2
echo "Setting up PM2 process manager..."
cd $DEPLOY_DIR
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Create logs directory for PM2
mkdir -p $DEPLOY_DIR/logs
chmod 755 $DEPLOY_DIR/logs

# Set up database backup script
echo "Setting up database backup..."
cp backup-database.sh /etc/cron.daily/backup-multiconvertai
chmod +x /etc/cron.daily/backup-multiconvertai
mkdir -p /var/backups/multiconvertai
chown -R postgres:postgres /var/backups/multiconvertai

# Final instructions
echo ""
echo "=== Deployment Complete ==="
echo "Your application should now be running at: http://168.231.82.38"
echo ""
echo "Next steps:"
echo "1. Update your .env file with correct database credentials"
echo "   nano $DEPLOY_DIR/.env"
echo "2. Set up SSL with Let's Encrypt when you have a domain:"
echo "   certbot --nginx -d yourdomain.com -d www.yourdomain.com"
echo "3. Monitor your application with:"
echo "   $DEPLOY_DIR/monitor.sh"
echo ""
echo "For more information, see HOSTINGER_DEPLOYMENT_GUIDE.md"
