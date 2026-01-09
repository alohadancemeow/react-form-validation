# 1️⃣ Build stage
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# 2️⃣ Production stage
FROM nginx:alpine

# Cloud Run requires port 8080
EXPOSE 8080

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# Update nginx to listen on 8080 instead of 80
RUN sed -i 's/80/8080/g' /etc/nginx/conf.d/default.conf

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
