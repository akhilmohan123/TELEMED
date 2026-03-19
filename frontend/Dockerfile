# Stage 1: Build React
FROM node:18 AS build
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all React files
COPY . .

# Build for production
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:latest

# Copy build from previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]