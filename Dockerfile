# Use an official Node.js runtime as the base image
FROM node:18 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the app code to the container
COPY . .

# Build the React + Vite app
RUN npm run build

# Use Nginx as the server to serve the app
FROM nginx:1-alpine-slim

# Copy the build output from the build stage to the nginx directory
COPY --from=build /app/dist /usr/share/nginx/html

# Start Nginx (this is the command that will be executed when the container starts)
CMD ["nginx", "-g", "daemon off;"]