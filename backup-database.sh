#!/bin/bash

# Database backup script for MultiConvert AI

# Configuration
BACKUP_DIR="./backups"
FILENAME="multiconvertai_$(date +%Y%m%d_%H%M%S).sql"
RETENTION_DAYS=7

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL environment variable is not set."
  echo "Please set DATABASE_URL or specify connection parameters manually in this script."
  exit 1
fi

# Extract database connection details from DATABASE_URL
# Format: postgresql://username:password@hostname:port/database
DB_URL="$DATABASE_URL"
DB_USER=$(echo $DB_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
DB_PASS=$(echo $DB_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')
DB_HOST=$(echo $DB_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
DB_PORT=$(echo $DB_URL | sed -n 's/.*@[^:]*:\([0-9]*\)\/.*/\1/p')
DB_NAME=$(echo $DB_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')

echo "Creating backup of database $DB_NAME from $DB_HOST..."

# Use PGPASSWORD to avoid password prompt
export PGPASSWORD="$DB_PASS"

# Create the backup
pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$BACKUP_DIR/$FILENAME"
BACKUP_RESULT=$?

# Unset password environment variable for security
unset PGPASSWORD

# Check backup result
if [ $BACKUP_RESULT -ne 0 ]; then
  echo "ERROR: Database backup failed with exit code $BACKUP_RESULT"
  exit $BACKUP_RESULT
fi

# Compress the backup
gzip "$BACKUP_DIR/$FILENAME"
echo "Backup created: $BACKUP_DIR/$FILENAME.gz"

# Delete old backups (older than RETENTION_DAYS)
find $BACKUP_DIR -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete
echo "Removed backups older than $RETENTION_DAYS days"

echo "Database backup completed successfully."
