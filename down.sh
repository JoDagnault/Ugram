#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if [[ "${1:-}" == "--dev" ]]; then
    shift
    docker compose -f docker-compose.yml -f docker-compose.dev.yml down "$@"
else
    docker compose -f docker-compose.yml down "$@"
fi
