/* eslint-disable import/no-extraneous-dependencies */
import users from './users';

const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const { pool } = require('pg');

const app = express();

const pool = new Pool({
  user: 'sampleUsername',
  host: 'localhost',
  database: 'myDatabase',
  password: 'samplePassword',
  port: 5432,
});

pool.query('SELECT NOW()', (err, res) => {
  console.log(err, res);
  pool.end();
});

app.use(express.json());

const secret = process.env.JWT_SECRET || 'secret';

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'validUsername' && password === 'validPassword') {
    const token = jwt.sign({ id: user.id }, secret, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid username or password' });
  }
});

app.use((req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, secret);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  } else {
    res.status(401).json({ message: 'No token' });
  }
});

app.get('/api/data', (req, res) => {
  // You can access the user object on the request object
  const data = { message: 'Secret data', user: req.user };
  res.json(data);
});

app.use('/static', express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/bundle.js', (req, res) => {
  res.set('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, 'dist', 'bundle.js'));
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
