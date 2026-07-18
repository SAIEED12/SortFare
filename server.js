const http = require('http');
const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const port = process.env.PORT || 3000;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
};

const server = http.createServer((req, res) => {
  let requestedPath = req.url === '/' ? '/index.html' : req.url;
  const safePath = path.normalize(requestedPath).replace(/^\/+/, '');
  const absolutePath = path.join(rootDir, 'public', safePath);

  if (!absolutePath.startsWith(path.join(rootDir, 'public'))) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(absolutePath, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    const extension = path.extname(absolutePath);
    res.writeHead(200, { 'Content-Type': mimeTypes[extension] || 'text/plain; charset=utf-8' });
    res.end(data);
  });
});

server.listen(port, () => {
  console.log(`Server listening on http://127.0.0.1:${port}`);
});
