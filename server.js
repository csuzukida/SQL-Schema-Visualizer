const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use(
  '/static',
  express.static(path.join(__dirname, 'dist'), {
    // Disable compression for CSS files
    setHeaders: (res, p) => {
      if (p.endsWith('.css')) {
        res.setHeader('Content-Encoding', 'identity');
      }
    },
  }),
);

app.get('/', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/styles.css', (req, res) => {
  res.set('Content-Type', 'text/css');
  res.sendFile(path.join(__dirname, 'dist', 'styles.css'));
});

app.get('/bundle.js', (req, res) => {
  res.set('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, 'dist', 'bundle.js'));
});

app.use('/static', express.static(path.join(__dirname, 'dist')));

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
