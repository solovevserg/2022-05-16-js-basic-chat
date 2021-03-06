FROM node:18-alpine3.14

WORKDIR /usr/src/app/server

COPY server/package*.json .
RUN npm ci --only=production

COPY . ..
EXPOSE 80
CMD [ "node", "server.js" ]
