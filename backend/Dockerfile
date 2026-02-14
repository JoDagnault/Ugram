# -------------------------
# 1 — BUILDER
# -------------------------
FROM node:22-alpine AS builder

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json

COPY backend backend
COPY frontend frontend

RUN npm install -g pnpm
RUN pnpm install

WORKDIR /app/backend
RUN pnpm prisma generate
RUN pnpm run build

# -------------------------
# 2 — RUNTIME
# -------------------------
FROM node:22-alpine AS runtime

WORKDIR /app

COPY --from=builder /app/backend/dist dist
COPY --from=builder /app/backend/dist/prisma dist/prisma
COPY --from=builder /app/backend/package.json package.json
COPY --from=builder /app/backend/src/generated dist/src/generated
COPY --from=builder /app/backend/prisma prisma
COPY --from=builder /app/backend/prisma.config.ts prisma.config.ts

RUN npm install -g pnpm
RUN pnpm install --prod

EXPOSE 3000

CMD ["node", "dist/src/index.js"]
