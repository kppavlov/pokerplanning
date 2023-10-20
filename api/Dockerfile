# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory within the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
COPY tsconfig.json ./
COPY . .

# Install application dependencies
RUN npm install
RUN npm run build

# Expose port 80 for the application
EXPOSE 80

# Define the command to start your Node.js application
CMD ["node", "./dist/index.js"]
