# Use the official Node.js image as a base image
FROM node:20.11.1

# Set the working directory inside the container
WORKDIR /usr/app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY src/ ./src
COPY tsconfig.json .
COPY drizzle ./drizzle

# Build TypeScript code
RUN npm run build:ts

# Expose port 3000
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "deployDocker"]