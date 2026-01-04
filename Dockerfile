# Stage 1: Build the application
FROM node:22-alpine AS build
WORKDIR /app

# Copy package configuration and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Build the project
RUN npm run build

# Stage 2: Serve the application with Caddy
FROM caddy:2-alpine
WORKDIR /usr/share/caddy

# Copy the Caddyfile from the build stage
COPY --from=build /app/Caddyfile /etc/caddy/Caddyfile

# Copy the built application from the build stage
COPY --from=build /app/dist .

# Expose the port Caddy listens on
EXPOSE 80
