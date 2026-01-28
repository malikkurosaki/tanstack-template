# 🛡️ Sistem Backup & Restore OpenCode

Sistem ini memastikan setiap perubahan pada project selalu bisa dikembalikan (restore) ke kondisi sebelumnya menggunakan Git auto-commit.

## 📁 File Sistem Backup

### Script Utama
- **`.opencode/pre-commit.sh`** - Auto-commit script yang dijalankan sebelum setiap perubahan
- **`.opencode/restore.sh`** - Script untuk merestore project ke commit tertentu
- **`.opencode/logs.sh`** - Script untuk melihat history backup
- **`.git/hooks/pre-commit`** - Git hook yang memanggil pre-commit script
- **`bin/backup.sh`** - Quick backup command
- **`bin/opencode-safe.sh`** - Wrapper untuk menjalankan OpenCode dengan auto-backup

### Konfigurasi
- **`opencode.jsonc`** - Konfigurasi backup system

## 🚀 Penggunaan

### 1. Auto-Backup (Otomatis)
Backup otomatis berjalan ketika:
- Anda melakukan `git commit`
- Git pre-commit hook di-trigger
- Menjalankan wrapper `bin/opencode-safe.sh`

### 2. Manual Backup
```bash
# Quick backup
bash bin/backup.sh

# Atau langsung
bash .opencode/pre-commit.sh
```

### 3. Melihat History Backup
```bash
bash .opencode/logs.sh
```

### 4. Restore Project
```bash
bash .opencode/restore.sh
```
Lalu masukkan hash commit yang ingin direstore.

## 📋 Cara Kerja

### Flow Backup Otomatis
```
Perubahan File
     ↓
Git pre-commit hook ter-trigger
     ↓
.pre-commit.sh dijalankan
     ↓
Cek ada perubahan?
     ↓ [Ya] → git add -A → git commit → ✅ Backup selesai
     ↓ [Tidak] → ℹ️  Skip backup
```

### Format Commit Message
```
Auto-commit backup: OpenCode pre-operation (2026-01-29 07:07:00)
```

## 🔒 Fitur Keamanan

### ✅ Apa yang Dilindungi?
- ✅ Semua file yang di-track oleh Git
- ✅ File baru yang belum di-track
- ✅ Perubahan kode, config, dan documentation

### ⚠️ Apa yang Tidak Dilindungi?
- ❌ File di `.gitignore` (node_modules, .output, etc)
- ❌ Environment variables (jika di .gitignore)
- ❌ Temporary files

## 📊 Monitoring

### Log File
Log disimpan di: `.opencode/backup.log`

Contoh log:
```
[2026-01-29 07:07:00] ⚠️  Menemukan perubahan, melakukan auto-commit...
[2026-01-29 07:07:00] ✅ Backup berhasil: Auto-commit backup: OpenCode pre-operation
[2026-01-29 07:08:00] ℹ️  Tidak ada perubahan, skip backup
```

### Git History
```bash
# Lihat semua commit
git log --oneline

# Lihat detail commit
git show <commit-hash>
```

## 🎯 Best Practices

### Sebelum Operasi Destructive
Selalu lakukan backup sebelum:
- Menghapus banyak file
- Refactor besar-besaran
- Mengubah database schema
- Update dependencies major

### Setelah Operasi Berhasil
Commit manual dengan pesan yang deskriptif:
```bash
git add .
git commit -m "feat: Add new user management feature"
```

## 🔄 Recovery Scenarios

### Scenario 1: Salah Hapus File
```bash
bash .opencode/restore.sh
# Pilih commit sebelum file dihapus
```

### Scenario 2: Bug Setelah Change
```bash
# Cek history
bash .opencode/logs.sh

# Lihat commit
git log --oneline -10

# Restore
bash .opencode/restore.sh
```

### Scenario 3: Branching untuk Eksperiment
```bash
# Buat branch dari backup
git checkout -b experiment <backup-commit-hash>

# Lakukan eksperiment...

# Jika gagal, kembali ke main
git checkout main
git branch -D experiment
```

## ⚙️ Konfigurasi

Edit `opencode.jsonc`:
```jsonc
{
  "backup": {
    "enabled": true,
    "method": "git",
    "autoBackupBeforeChanges": true,
    "maxLogLines": 1000
  },
  "safety": {
    "confirmBeforeDestructive": true,
    "warnBeforeOverwrite": true,
    "keepSnapshots": 10
  }
}
```

## 🐛 Troubleshooting

### Backup tidak berjalan?
1. Cek permission script: `ls -la .opencode/pre-commit.sh`
2. Cek git hook: `ls -la .git/hooks/pre-commit`
3. Cek log: `cat .opencode/backup.log`

### Restore gagal?
1. Pastikan commit hash valid: `git log --oneline`
2. Pastikan tidak ada perubahan uncommitted: `git status`
3. Pastikan di branch yang benar: `git branch`

### Git hooks tidak berjalan?
1. Cek permission: `ls -la .git/hooks/pre-commit`
2. Pastikan executable: `chmod +x .git/hooks/pre-commit`
3. Cek konfigurasi git: `git config --list | grep core.hooksPath`

## 📞 Support

Jika ada masalah dengan sistem backup:
1. Cek log file: `cat .opencode/backup.log`
2. Cek git status: `git status`
3. Lihat commit history: `git log --oneline -10`

---

**Last Updated:** 2026-01-29
**Version:** 0.1.0
