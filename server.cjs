/**
 * Production static file server for AiVanta frontend.
 * Used by Railway deployment. Handles SPA routing.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'font/otf',
  '.map': 'application/json',
};

const server = http.createServer((req, res) => {
  // Decode URL to handle spaces and special chars
  let urlPath = decodeURIComponent(req.url);

  // Remove query string and hash for file lookup
  const cleanPath = urlPath.split('?')[0].split('#')[0];

  let filePath = path.join(DIST_DIR, cleanPath === '/' ? 'index.html' : cleanPath);

  // Security: prevent directory traversal
  const resolvedDist = path.resolve(DIST_DIR);
  const resolvedFile = path.resolve(filePath);
  if (!resolvedFile.startsWith(resolvedDist)) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  // SPA routing: serve index.html for non-file paths
  const ext = path.extname(filePath);
  if (!ext || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  const fileExt = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[fileExt] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      console.error(`Error serving ${filePath}:`, err.message);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
      return;
    }
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': fileExt === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
    });
    res.end(content);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`AiVanta frontend server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    process.exit(0);
  });
});
