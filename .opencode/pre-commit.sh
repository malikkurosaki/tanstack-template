#!/bin/bash
# Auto-commit script untuk backup sebelum perubahan OpenCode
# File: .opencode/pre-commit.sh

set -e

# Log file
LOG_FILE=".opencode/backup.log"
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")

# Buat directory log jika belum ada
mkdir -p "$(dirname "$LOG_FILE")"

# Cek apakah ada perubahan
if ! git diff-index --quiet HEAD -- 2>/dev/null; then
	# Ada perubahan di tracked files
	echo "[$TIMESTAMP] ⚠️  Menemukan perubahan, melakukan auto-commit..." >>"$LOG_FILE"

	# Add semua perubahan
	git add -A

	# Commit dengan timestamp
	COMMIT_MSG="Auto-commit backup: OpenCode pre-operation ($TIMESTAMP)"
	git commit -m "$COMMIT_MSG" --no-verify

	echo "[$TIMESTAMP] ✅ Backup berhasil: $COMMIT_MSG" >>"$LOG_FILE"
	exit 0
elif [ -n "$(git ls-files --others --exclude-standard)" ]; then
	# Ada untracked files
	echo "[$TIMESTAMP] 📝 Menemukan file baru, melakukan auto-commit..." >>"$LOG_FILE"

	# Add semua file
	git add -A

	# Commit dengan timestamp
	COMMIT_MSG="Auto-commit backup: OpenCode pre-operation - new files ($TIMESTAMP)"
	git commit -m "$COMMIT_MSG" --no-verify

	echo "[$TIMESTAMP] ✅ Backup berhasil: $COMMIT_MSG" >>"$LOG_FILE"
	exit 0
else
	# Tidak ada perubahan
	echo "[$TIMESTAMP] ℹ️  Tidak ada perubahan, skip backup" >>"$LOG_FILE"
	exit 0
fi
