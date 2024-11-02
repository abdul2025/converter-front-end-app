# Use a Node.js image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the Angular project files to the container
COPY . .

# Expose the default Angular development port
EXPOSE 4200

# Start Angular in development mode with live-reload
CMD ["npm", "start"]
