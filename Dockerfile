FROM node:18-alpine
ENV NODE_OPTIONS=--max-old-space-size=4096
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 40000
CMD [ "node", "dist/main.js" ]
