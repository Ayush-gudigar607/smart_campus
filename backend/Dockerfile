# Install dependencies first so Docker can reuse this layer until package files change.
FROM node:22-alpine

WORKDIR /app

# bcrypt may need to compile when a matching prebuilt binary is unavailable.
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci

COPY . .

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "src/server.js"]
