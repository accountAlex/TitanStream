FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn prisma generate

RUN yarn build

FROM node:20-alpine


WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile --production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY prisma ./prisma

COPY .env ./

EXPOSE 3000

CMD ["node", "dist/main.js"]
