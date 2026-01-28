#!/bin/bash
# Quick backup command untuk manual backup
# File: bin/backup.sh

PROJECT_ROOT="/Users/bip/Documents/projects/tanstack/tan-app"
cd "$PROJECT_ROOT" || exit 1

if [ -f ".opencode/pre-commit.sh" ]; then
	bash .opencode/pre-commit.sh
else
	echo "❌ Error: pre-commit script tidak ditemukan"
	exit 1
fi
