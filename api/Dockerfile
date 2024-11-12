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

# Expose port 3000 for the application
EXPOSE 3000
ENV NODE_ENV=production

# Define the command to start your Node.js application
CMD ["node", "./dist/index.js"]
