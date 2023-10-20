# Use the official NGINX base image
FROM node:18-alpine as builder

# Set the working directory within the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
COPY tsconfig.json ./
COPY . .

# Install application dependencies
RUN npm install
RUN npm run build

FROM nginx
COPY  nginx.config /etc/nginx/

ADD nginx.config /etc/nginx/conf.d/default.conf

COPY --from=builder ./app/dist /var/www/poker.threesixtybg.com/pokerplanning/html/dist

# Expose port 80 for the application
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
