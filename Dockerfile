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

# Install serve globally for static file serving
RUN npm install -g serve

# Copy built assets from builder
COPY --from=builder /app/dist ./dist

# Railway provides PORT env var; default to 3000 locally
ENV PORT=3000
EXPOSE 3000

# Serve the built SPA (single-page app mode handles React Router)
CMD serve -s dist -l $PORT
