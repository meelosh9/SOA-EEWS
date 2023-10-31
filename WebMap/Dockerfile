FROM node:lts-alpine as build-npm-stage

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY index.html ./
COPY public ./public
COPY src ./src
COPY vite.config.ts ./
COPY tsconfig.json ./
COPY tsconfig.node.json ./

EXPOSE 5173

CMD ["npm", "start"]
