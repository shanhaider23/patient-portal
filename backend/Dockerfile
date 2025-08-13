# Backend Dockerfile

# -------- Build Stage --------
FROM node:20 AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy all source files
COPY . .

# Build TypeScript
RUN npm run build

# -------- Run Stage --------
FROM node:20

WORKDIR /app

# Create data folder for SQLite
RUN mkdir -p /app/data

# Copy built code and node_modules from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/node_modules ./node_modules

# Expose port
EXPOSE 4000

# Environment variable for SQLite path
ENV DB_FILE=/app/data/patients.sqlite3

# Start the backend
CMD ["node", "dist/index.js"]
