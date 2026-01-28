#!/bin/bash
# Log viewer untuk melihat history backup
# File: .opencode/logs.sh

LOG_FILE=".opencode/backup.log"

if [ ! -f "$LOG_FILE" ]; then
	echo "📋 Belum ada log backup"
	exit 0
fi

echo "=========================================="
echo "📋 History Backup:"
echo "=========================================="
tail -20 "$LOG_FILE"
echo ""
echo "Total lines: $(wc -l <"$LOG_FILE")"
