# Stage 1: Build & Dependency Stage
FROM node:20-alpine AS build-stage

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDeps for potential builds/tools)
RUN npm install

# Copy source code
COPY . .

# Stage 2: Production Stage
FROM node:20-alpine AS production-stage

WORKDIR /app

# Copy ONLY production dependencies
COPY package*.json ./
RUN npm install --production

# Copy necessary source files and entrypoint
COPY . .
COPY --from=build-stage /app/docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Environment variable defaults
ENV PORT=5000
ENV NODE_ENV=production
ENV DB_PORT=3306
ENV RUN_MIGRATIONS=false
ENV RUN_SEEDS=false

EXPOSE 5000

# Use entrypoint script to handle migrations/seeds
ENTRYPOINT ["docker-entrypoint.sh"]

# Default command to start the application
CMD [ "node", "server.js" ]
