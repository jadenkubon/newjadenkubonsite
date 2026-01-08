// Simple Node.js server for local testing with clean URLs
// Run with: node server.js
// Then visit: http://localhost:3000/recruiting/process

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;
const ROOT_DIR = __dirname;

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
    let pathname = url.parse(req.url).pathname;
    
    // Remove .html extension from URL if present
    if (pathname.endsWith('.html')) {
        res.writeHead(301, { 'Location': pathname.replace('.html', '') });
        res.end();
        return;
    }
    
    // Handle root
    if (pathname === '/') {
        pathname = '/index.html';
    }
    // Handle /recruiting/ - serve home.html
    else if (pathname === '/recruiting/' || pathname === '/recruiting') {
        pathname = '/recruiting/home.html';
    }
    // Handle clean URLs in recruiting folder
    else if (pathname.startsWith('/recruiting/') && !pathname.endsWith('.html')) {
        const file = pathname.split('/').pop();
        if (file) {
            pathname = `/recruiting/${file}.html`;
        }
    }
    // Add .html extension if file doesn't exist and no extension is present
    else if (!pathname.includes('.') && pathname !== '/') {
        const fullPath = path.join(ROOT_DIR, pathname + '.html');
        if (fs.existsSync(fullPath)) {
            pathname = pathname + '.html';
        }
    }
    
    const filePath = path.join(ROOT_DIR, pathname);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - File Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`, 'utf-8');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log(`Test clean URLs like: http://localhost:${PORT}/recruiting/process`);
});

