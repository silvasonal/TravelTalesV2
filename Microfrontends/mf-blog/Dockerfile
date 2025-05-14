# Use Node base image
FROM node:18

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy all mf-Blog files
COPY . .

# Build the React app
RUN npm run build

# Serve the app using a simple static server
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]