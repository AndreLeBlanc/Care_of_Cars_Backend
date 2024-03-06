# Use the official Node.js image as a base image
FROM node:20.11.1

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY src/ .
COPY package.json .
COPY tsconfig.json .

# Expose port 3000
EXPOSE 3000

# Command to run the application
CMD ["tsc", "&&" ,"fastify" ,"start", "-l", "info", "dist/app.js"]

