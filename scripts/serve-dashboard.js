#!/usr/bin/env node

/**
 * 🌐 BOD EXECUTIVE DASHBOARD LOCAL HTTP SERVER
 * 
 * Máy chủ HTTP nhẹ (Zero external dependencies) phục vụ Executive Dashboard
 * để kết nối với Cloudflare Tunnel (ai.example.com -> http://localhost:3000):
 * 
 * Cách dùng:
 *   node scripts/serve-dashboard.js               # Chạy mặc định trên port 3000
 *   PORT=8080 node scripts/serve-dashboard.js     # Chạy trên port tùy chọn
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = parseInt(process.env.PORT || '3000', 10);
const DASHBOARD_DIR = path.resolve(__dirname, '../reports/dashboard');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // CORS & Security headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  const filePath = path.normalize(path.join(DASHBOARD_DIR, reqPath));

  // Chống Directory Traversal
  if (!filePath.startsWith(DASHBOARD_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('403 Forbidden');
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('404 Not Found');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  res.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🌿 [Executive Dashboard Server] Đang chạy tại http://localhost:${PORT}`);
  console.log(`📁 Thư mục gốc: ${DASHBOARD_DIR}`);
  console.log(`🔗 Sẵn sàng ánh xạ Cloudflare Tunnel: ai.example.com -> http://localhost:${PORT}\n`);
});
