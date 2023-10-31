FROM node:alpine
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 50052
CMD ["node", "notification_server.js"]