FROM node:22-alpine as dev
WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm ci

COPY . .

EXPOSE 3000
CMD ["node", "--inspect=0.0.0.0:9229", "./index.mjs"]

FROM node:22-alpine as prod
WORKDIR /app

COPY package.json .
COPY package-lock.json .
ENV NODE_ENV=production
RUN npm ci

COPY . .

EXPOSE 3000
CMD ["node", "./index.mjs"]