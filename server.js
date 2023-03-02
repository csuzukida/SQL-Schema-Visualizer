/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();

const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const fs = require('fs');

const dbPassword = process.env.DB_PASSWORD;

const app = express();

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'SQL Test',
  password: dbPassword,
  port: 5432,
});

app.use(express.json());
app.use(
  '/static',
  express.static(path.join(__dirname, 'dist'), {
    // Disable compression for CSS files and serve .map files
    setHeaders: (res, p) => {
      if (p.endsWith('.css')) {
        res.setHeader('Content-Encoding', 'identity');
      }
      if (p.endsWith('.map')) {
        res.setHeader('Content-Type', 'application/json');
      }
    },
  }),
);
app.use(
  '/flow',
  express.static(path.join(__dirname, 'node_modules', 'react-flow-renderer', 'dist', 'esm')),
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

app.get('/api/schemas', async (req, res) => {
  try {
    const publicSchemaQuery = `
      SELECT
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM
        information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      LEFT JOIN information_schema.tables AS t
        ON t.table_name = ccu.table_name
      WHERE constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public';
    `;

    const allTablesQuery = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `;

    const client = await pool.connect();
    const tablesWithForeignKeys = await client.query(publicSchemaQuery);
    const allTables = await client.query(allTablesQuery);

    const tablesWithForeignKeysFormatted = tablesWithForeignKeys.rows.map((row) => ({
      table_name: row.table_name,
      id: '_id',
      foreign_key: row.column_name || null,
      references: row.foreign_table_name === row.table_name ? null : row.foreign_table_name,
      referenced_key_name: row.foreign_column_name || null,
    }));

    const allTablesFormatted = allTables.rows.map((row) => ({
      table_name: row.table_name,
      id: '_id',
      foreign_key: null,
      references: null,
      referenced_key_name: null,
    }));

    const result = [
      ...tablesWithForeignKeysFormatted,
      ...allTablesFormatted.filter(
        (table) => !tablesWithForeignKeysFormatted.some(
          (tableWithForeignKey) => tableWithForeignKey.table_name === table.table_name,
        ),
      ),
    ];

    res.json({ result });
    client.release();
  } catch (err) {
    console.log(err);
    res.status(500).send('Error getting schemas');
  }
});

app.get('/flow/:file', (req, res) => {
  const { file } = req.params;
  const mapFile = path.join(
    __dirname,
    'node_modules',
    'react-flow-renderer',
    'dist',
    'esm',
    `${file}.js.map`,
  );
  if (!fs.existsSync(mapFile)) {
    res.status(404).send(`Source map not found for ${file}`);
  } else {
    res.set('Content-Type', 'application/json');
    res.sendFile(mapFile);
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
