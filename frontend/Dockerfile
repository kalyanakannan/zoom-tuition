# Use official Node.js image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json .

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Build the React app for production
RUN npm run build

# Serve the app using a lightweight server
RUN npm install -g serve
CMD ["serve", "-s", "build"]

# Expose the application port
EXPOSE 3000
