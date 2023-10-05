# Use the official Node.js image as the base image
FROM node:16

# Set the working directory in the Docker container
WORKDIR /data

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the Node.js packages defined in package.json
RUN npm install

# Copy the rest of the application to the working directory
COPY . .

# Define the command to run the app
CMD ["npm", "start"]