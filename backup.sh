#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Configuration variables (adjust these to your paths)
SOURCE_DIR="./src"
BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)
ARCHIVE_NAME="backup_$TIMESTAMP.tar.gz"

# Ensure backup destination exists
mkdir -p "$BACKUP_DIR"

echo "[$TIMESTAMP] Starting backup..."

# Create compressed tarball of the source directory
tar -czf "$BACKUP_DIR/$ARCHIVE_NAME" -C "$SOURCE_DIR" .

echo "[$TIMESTAMP] Backup successfully created at: $BACKUP_DIR/$ARCHIVE_NAME"

# Optional: Remove backups older than 7 days
find "$BACKUP_DIR" -name "backup_*.tar.gz" -mtime +7 -delete
echo "Cleaned up archives older than 7 days."
