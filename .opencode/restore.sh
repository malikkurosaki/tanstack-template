#!/bin/bash
# Restore script untuk mengembalikan file dari commit sebelumnya
# File: .opencode/restore.sh

set -e

# Log file
LOG_FILE=".opencode/backup.log"
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")

# Tampilkan 5 commit terakhir
echo "=========================================="
echo "📜 5 Commit Terakhir:"
echo "=========================================="
git log --oneline -5
echo ""

# Tanya user ingin restore ke commit mana
read -p "Masukkan hash commit yang ingin direstore (atau 'cancel' untuk batal): " COMMIT_HASH

if [ "$COMMIT_HASH" = "cancel" ]; then
	echo "❌ Dibatalkan oleh user"
	exit 0
fi

# Cek apakah commit valid
if ! git rev-parse "$COMMIT_HASH" >/dev/null 2>&1; then
	echo "❌ Error: Commit hash tidak valid"
	exit 1
fi

# Konfirmasi
echo ""
echo "⚠️  Anda akan merestore semua file ke commit: $COMMIT_HASH"
read -p "Apakah Anda yakin? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
	echo "❌ Dibatalkan oleh user"
	exit 0
fi

# Lakukan hard reset
git reset --hard "$COMMIT_HASH"

# Log restore
echo "[$TIMESTAMP] 🔄 Restore ke commit $COMMIT_HASH" >>"$LOG_FILE"

echo "✅ Restore berhasil! Project sekarang di commit: $COMMIT_HASH"
