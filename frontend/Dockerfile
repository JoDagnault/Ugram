# -------------------------
# 1 — BUILDER
# -------------------------
FROM node:22-alpine AS builder

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json

RUN npm install -g pnpm

RUN pnpm install

COPY frontend frontend

WORKDIR /app/frontend
RUN pnpm run build


# -------------------------
# 2 — RUNTIME
# -------------------------
FROM nginx:stable-alpine AS runtime

COPY --from=builder /app/frontend/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
