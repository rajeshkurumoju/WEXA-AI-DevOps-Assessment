# Stage 1 — Build lightweight Node.js image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of your app source code
COPY . .

# Expose app port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]

