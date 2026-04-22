# Stage 1: Build Stage
FROM node:20-alpine AS build-stage

WORKDIR /app

# Accept build arguments for environment variables
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
# Note: VITE_ variables must be present during build time
RUN npm run build-only

# Stage 2: Production Stage
FROM nginx:alpine AS production-stage

# Copy the build output from the first stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy a custom Nginx configuration to handle SPA routing (History mode)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port (user requested 3000)
EXPOSE 3000

# Overwrite Nginx to listen on 3000 in the conf file if needed 
# or just rely on the COPY nginx.conf

CMD ["nginx", "-g", "daemon off;"]
