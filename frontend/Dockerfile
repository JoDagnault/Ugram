# -------------------------
# STAGE 1 — BUILDER
# -------------------------
FROM node:22-alpine AS builder

WORKDIR /app

# Copie les fichiers du workspace
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# Copie les manifests des deux packages
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json

# Copie tout le code du workspace
COPY backend backend
COPY frontend frontend

# Installe pnpm
RUN npm install -g pnpm

# Installe les dépendances du workspace
RUN pnpm install --prod=false

# Build du frontend
WORKDIR /app/frontend
RUN pnpm run build


# -------------------------
# STAGE 2 — RUNTIME
# -------------------------
FROM nginx:stable-alpine AS runtime

# Copie les fichiers statiques buildés
COPY --from=builder /app/frontend/dist /usr/share/nginx/html

EXPOSE 80
