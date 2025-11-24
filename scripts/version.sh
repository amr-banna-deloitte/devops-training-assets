#!/usr/bin/env bash
set -euo pipefail

SHA=${GITHUB_SHA:-$(git rev-parse --short HEAD)}
DATE=$(date -u +%Y%m%d%H%M%S)
FILE=${1:-app/dist/version.txt}

mkdir -p "$(dirname "$FILE")"
echo "sha=${SHA}" > "$FILE"
echo "built_at=${DATE}Z" >> "$FILE"
