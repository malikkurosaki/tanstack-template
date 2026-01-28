#!/bin/bash
# Wrapper script untuk OpenCode dengan auto-backup
# File: bin/opencode-safe.sh

set -e

PROJECT_ROOT="/Users/bip/Documents/projects/tanstack/tan-app"
cd "$PROJECT_ROOT" || exit 1

echo "🛡️  OpenCode Safety Wrapper"
echo "=========================================="

# Step 1: Jalankan pre-commit backup
if [ -f ".opencode/pre-commit.sh" ]; then
	echo "📦 Membuat backup sebelum perubahan..."
	bash .opencode/pre-commit.sh
	echo ""
fi

# Step 2: Jalankan perintah OpenCode
echo "🚀 Menjalankan OpenCode..."
echo ""

# Jalankan perintah yang diteruskan dari user
"$@"

echo ""
echo "=========================================="
echo "✅ Selesai! Perubahan tersimpan di Git"
echo ""
echo "💡 Gunakan untuk restore:"
echo "   bash .opencode/restore.sh"
echo ""
echo "📋 Lihat log backup:"
echo "   bash .opencode/logs.sh"
