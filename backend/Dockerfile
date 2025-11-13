FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --production=false
COPY . .
ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "server.js"]
