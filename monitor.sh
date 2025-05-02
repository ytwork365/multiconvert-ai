#!/bin/bash

# Simple monitoring script for MultiConvert AI on Hostinger VPS

echo "=== MultiConvert AI Monitoring Report ==="
echo "Generated on: $(date)"
echo ""

# Check if the application is running
if pm2 list | grep -q "multiconvert-ai-168.231.82.38"; then
  echo "✅ Application is running"
  
  # Get PM2 status
  echo "\nPM2 Status:"
  pm2 info multiconvert-ai-168.231.82.38 | grep -E "(status|cpu|memory|restarts|uptime)"
  
  # Get recent logs
  echo "\nRecent Logs (last 10 lines):"
  tail -n 10 logs/out.log
  
  # Get recent errors
  echo "\nRecent Errors (last 10 lines):"
  tail -n 10 logs/error.log
else
  echo "❌ Application is NOT running"
fi

# Check disk space
echo "\nDisk Space:"
df -h | grep -E "/dev/(sd|vd|xvd)"

# Check memory usage
echo "\nMemory Usage:"
free -h

# Check for high CPU processes
echo "\nTop CPU Processes:"
ps aux --sort=-%cpu | head -n 6

# Check for PostgreSQL
echo "\nPostgreSQL Status:"
if systemctl is-active postgresql &> /dev/null; then
  echo "✅ PostgreSQL is running"
else
  echo "❌ PostgreSQL is NOT running"
fi

# Check nginx
echo "\nnginx Status:"
if systemctl is-active nginx &> /dev/null; then
  echo "✅ nginx is running"
else
  echo "❌ nginx is NOT running"
fi

# Check for recent failed login attempts
echo "\nRecent Failed Login Attempts:"
grep "Failed password" /var/log/auth.log | tail -n 5

echo "\n=== End of Monitoring Report ==="
