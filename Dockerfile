# ============================================================
# AiVanta Frontend — Railway Deployment Dockerfile
# ============================================================

# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Railway injects env vars as Docker build-args.
# Declaring them here ensures Docker INVALIDATES the build cache
# when any of these values change, so Vite picks up the new values.
ARG VITE_API_URL
ARG VITE_WS_URL
ARG VITE_SOCKET_URL
ARG VITE_USE_DUMMY_DATA

# Make them available to Vite during `npm run build`
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_WS_URL=$VITE_WS_URL
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL
ENV VITE_USE_DUMMY_DATA=$VITE_USE_DUMMY_DATA

# Build the app (env vars above are inlined by Vite)
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
