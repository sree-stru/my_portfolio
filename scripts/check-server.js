const http = require('http');
const urls = ['http://localhost:5173/', 'http://localhost:5173/src/main.jsx', 'http://localhost:5173/src/App.jsx'];

function get(u) {
  return new Promise((resolve, reject) => {
    http.get(u, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (c) => (body += c));
      res.on('end', () => resolve({ status: res.statusCode, body }));
    }).on('error', (err) => reject(err));
  });
}

(async () => {
  for (const u of urls) {
    try {
      const r = await get(u);
      console.log('URL:', u, '->', r.status);
      console.log('--- snippet ---');
      console.log(r.body.slice(0, 1000));
      console.log('--- end ---\n');
    } catch (e) {
      console.error('Fetch error for', u, e.message || e);
    }
  }
})();
