# Use Node.js base image
FROM node:18

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app files
COPY . .

# Expose blog-service port
EXPOSE 5000

# Start the server
CMD ["node", "app.js"]
