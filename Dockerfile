FROM node:22-alpine AS build
WORKDIR /app

# Accept build-time argument from Railway
#ARG VITE_API_URL
#ENV VITE_API_URL=$VITE_API_URL

COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build
FROM caddy:2-alpine
WORKDIR /usr/share/caddy
COPY --from=build /app/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist .
EXPOSE 80

