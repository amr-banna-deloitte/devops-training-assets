'use strict';
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.status(200).send('Hello from DevOps Sample App!');
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

module.exports = app;
