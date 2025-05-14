# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json .
RUN npm install

# Copy remaining source files
COPY . .

# Expose port
EXPOSE 7000

# Start the app
CMD ["npm", "start"]
