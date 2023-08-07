const express = require('express');
const mysql = require('mysql2/promise');
const db = require('./db');
const userRoute = express.Router();

userRoute.get('/:email', async (req, res) => {
  const { email } = req.params;

  try {
    

    const [results] = await db.execute('SELECT full_name FROM users WHERE email = ?', [email]);

    if (results.length > 0) {
      const name = results[0].full_name;
      res.status(200).json({ name });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    console.error('Error executing SQL query: ', err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = userRoute;
