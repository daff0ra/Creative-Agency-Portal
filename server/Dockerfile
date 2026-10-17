FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production

# package*.json disalin lebih dulu supaya hasil npm ci ter-cache selama dependensi tidak berubah
COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

USER node
EXPOSE 5000
CMD ["node", "server.js"]