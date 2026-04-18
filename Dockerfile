# ============================================================
# AiVanta Frontend — Railway Deployment Dockerfile
# ============================================================

# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# ---- Production Stage ----
FROM node:20-alpine

WORKDIR /app

# Copy built assets and server script
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.cjs ./server.cjs

# Railway provides PORT env var; default to 3000 locally
ENV PORT=3000
EXPOSE 3000

# Start the custom static file server
CMD ["node", "server.cjs"]
