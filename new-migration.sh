#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
    echo "Usage: $0 <migration_name>"
    exit 1
fi

MIGRATION_NAME="$1"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

COMPOSE_ARGS=(--env-file backend/.env -f docker-compose.yml)
PRISMA_DIR="$SCRIPT_DIR/backend/prisma"

if [[ ! -d "$PRISMA_DIR" ]]; then
    echo "Error: prisma directory not found at $PRISMA_DIR"
    exit 1
fi

POSTGRES_ALREADY_RUNNING=0
if [[ -n "$(docker compose "${COMPOSE_ARGS[@]}" ps --status running -q postgres)" ]]; then
    POSTGRES_ALREADY_RUNNING=1
fi

cleanup() {
    if [[ "$POSTGRES_ALREADY_RUNNING" -eq 0 ]]; then
        docker compose "${COMPOSE_ARGS[@]}" stop postgres >/dev/null
        echo "Postgres container stopped."
    fi
}
trap cleanup EXIT

docker compose "${COMPOSE_ARGS[@]}" up -d postgres
docker compose "${COMPOSE_ARGS[@]}" run --rm \
    -v "$PRISMA_DIR:/app/backend/prisma" \
    migrate pnpm --dir backend exec prisma migrate dev --name "$MIGRATION_NAME" --create-only

echo "Migration created under backend/prisma/migrations."
