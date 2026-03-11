FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml tsconfig.json ./
COPY prisma.config.ts ./prisma.config.ts
COPY prisma ./prisma
COPY src ./src

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

RUN pnpm prisma generate
RUN pnpm run build


FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app .
COPY wait-for-it.sh /usr/local/bin/wait-for-it.sh

RUN apk add --no-cache bash netcat-openbsd
RUN chmod +x /usr/local/bin/wait-for-it.sh
RUN npm install -g pnpm
RUN pnpm install --prod --ignore-scripts --frozen-lockfile

ENV NODE_ENV=production

EXPOSE 3000

CMD ["sh","-c","pnpm prisma:migrate:deploy && exec node dist/src/index.js"]
