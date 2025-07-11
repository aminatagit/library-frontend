# Frontend Dockerfile
FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
COPY tailwind.config.js postcss.config.js ./
RUN npm install
COPY . .
EXPOSE 3000
RUN npm run build
CMD ["npm", "start"]
