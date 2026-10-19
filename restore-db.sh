#!/bin/bash
# Database restore script for GDG GUG

BACKUP_DIR="/home/techteam/gdgwork/backups"

if [ -z "$1" ]; then
    echo "Usage: ./restore-db.sh <backup_file>"
    echo ""
    echo "Available backups:"
    ls -lh "$BACKUP_DIR"/gdg_db_backup_*.sql 2>/dev/null | awk '{print $9}' | xargs -n1 basename
    exit 1
fi

BACKUP_FILE="$BACKUP_DIR/$1"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "✗ Backup file not found: $BACKUP_FILE"
    exit 1
fi

echo "⚠️  WARNING: This will DROP and recreate the gdg_db database!"
echo "Backup file: $BACKUP_FILE"
read -p "Are you sure? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Restore cancelled."
    exit 0
fi

echo "Dropping existing database..."
docker exec gdg-postgres psql -U postgres -c "DROP DATABASE IF EXISTS gdg_db;"

echo "Creating fresh database..."
docker exec gdg-postgres psql -U postgres -c "CREATE DATABASE gdg_db;"

echo "Restoring backup..."
cat "$BACKUP_FILE" | docker exec -i gdg-postgres psql -U postgres gdg_db

if [ $? -eq 0 ]; then
    echo "✓ Database restored successfully!"
    echo "✓ Restart backend to apply changes"
else
    echo "✗ Restore failed!"
    exit 1
fi


