# -------------------------
# 1 — BUILDER
# -------------------------
FROM node:22-alpine AS builder

WORKDIR /app

# Copie les fichiers du workspace
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# Copie les manifests des deux packages
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json

# Copie le code du workspace
COPY backend backend
COPY frontend frontend

RUN npm install -g pnpm
RUN pnpm install

WORKDIR /app/backend
RUN pnpm run build

# -------------------------
# 2 — RUNTIME
# -------------------------
FROM node:22-alpine AS runtime

WORKDIR /app

COPY --from=builder /app/backend/dist dist
COPY --from=builder /app/backend/package.json package.json

RUN npm install -g pnpm
RUN pnpm install --prod

EXPOSE 3000

CMD ["node", "dist/index.js"]