const express = require('express');
const mysql = require('mysql2/promise');
const db = require('../db');
const scraperCheckerRoute = express.Router();

scraperCheckerRoute.get('/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const [results] = await db.execute('SELECT name FROM scrapers WHERE user_id = ?', [email]);

    if (results.length > 0) {
      const name = results[0].name;
      res.status(200).json({ name });
    } else {
      res.status(200).json({ name: 'null' });
    }
  } catch (err) {
    console.error('Error executing SQL query: ', err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = scraperCheckerRoute;

