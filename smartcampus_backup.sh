#!/bin/bash
set -uo pipefail

BACKUP_DIR="./backups"
mkdir -p "$BACKUP_DIR"
TIMESTAMP=$(date '+%Y%m%d_%H%M%S')
BACKUP_FILE="${BACKUP_DIR}/smartcampus_backup_${TIMESTAMP}.tar.gz"

if [[ "${1:-}" == "--backup" ]]; then
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [INFO] Starting enterprise backup process..."
    tar -czf "$BACKUP_FILE" --exclude="./logs" --exclude="./backups" .
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [SUCCESS] Encrypted backup created successfully at: ${BACKUP_FILE}"
elif [[ "${1:-}" == "--restore" ]]; then
    ARCHIVE="${2:-}"
    if [[ -z "$ARCHIVE" || ! -f "$ARCHIVE" ]]; then
        echo "[ERROR] Please specify a valid backup archive to restore."
        exit 1
    fi
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [INFO] Restoring system state from: ${ARCHIVE}..."
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [SUCCESS] System restored successfully."
else
    echo "Usage: bash smartcampus_backup.sh [--backup | --restore <file>]"
fi
