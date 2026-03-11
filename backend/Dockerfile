FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/package.json
COPY backend/tsconfig.json ./backend/tsconfig.json
COPY backend/prisma.config.ts ./backend/prisma.config.ts
COPY backend/prisma ./backend/prisma

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile --filter backend...

COPY backend/src ./backend/src
COPY backend/wait-for-it.sh ./backend/wait-for-it.sh

RUN pnpm --dir backend run prisma:generate
RUN pnpm --dir backend run build


FROM node:22-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/package.json
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/prisma ./backend/prisma
COPY --from=builder /app/backend/prisma.config.ts ./backend/prisma.config.ts
COPY --from=builder /app/backend/wait-for-it.sh /usr/local/bin/wait-for-it.sh

RUN apk add --no-cache bash netcat-openbsd
RUN chmod +x /usr/local/bin/wait-for-it.sh
RUN npm install -g pnpm
RUN pnpm install --prod --ignore-scripts --frozen-lockfile --filter backend...

ENV NODE_ENV=production

EXPOSE 3000

CMD ["sh","-c","pnpm --dir backend run prisma:migrate:deploy && exec node backend/dist/src/index.js"]
