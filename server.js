/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();

const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const dbPassword = process.env.DB_PASSWORD;

const app = express();

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'SQL Test',
  password: dbPassword,
  port: 5432,
});

pool.query('SELECT NOW()', (err, res) => {
  console.log(err, res);
  pool.end();
});

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
  res.sendFile(path.join(__dirname, 'src', 'styles.css'));
});

app.get('/bundle.js', (req, res) => {
  res.set('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, 'dist', 'bundle.js'));
});

app.use('/static', express.static(path.join(__dirname, 'dist')));

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
