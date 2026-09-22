FROM node:22-alpine
WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm ci

COPY . .

EXPOSE 3000
CMD ["node", "--inspect=0.0.0.0:9229", "./index.mjs"]