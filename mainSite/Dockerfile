# --- Build Stage ---
# Use Node.js to build the React app
FROM node:18-alpine AS build

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy all frontend source code
COPY . .

# Build the production-ready static files
# This creates the 'dist' folder
RUN npm run build

# --- Production Stage ---
# Use Nginx to serve the static files
FROM nginx:1.25-alpine

# Copy the built files from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy our NEW Nginx config file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80