# ---------- Stage 1: Build React ----------
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json from frontend
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy all frontend files
COPY frontend/. .

# Build React for production
RUN npm run build

# ---------- Stage 2: Serve with Nginx ----------
FROM nginx:latest

# Copy built files from previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]