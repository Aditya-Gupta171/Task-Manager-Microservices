FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Make start script executable
RUN chmod +x start.sh

# Expose the port
EXPOSE 3000

# Use the startup script
CMD ["sh", "./start.sh"]