#!/bin/bash
# Database backup script for GDG GUG

BACKUP_DIR="/home/techteam/gdgwork/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/gdg_db_backup_$TIMESTAMP.sql"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "Creating database backup..."
docker exec gdg-postgres pg_dump -U postgres gdg_db > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✓ Backup created successfully: $BACKUP_FILE"
    
    # Keep only last 10 backups
    cd "$BACKUP_DIR"
    ls -t gdg_db_backup_*.sql | tail -n +11 | xargs -r rm
    echo "✓ Old backups cleaned (keeping last 10)"
else
    echo "✗ Backup failed!"
    exit 1
fi


