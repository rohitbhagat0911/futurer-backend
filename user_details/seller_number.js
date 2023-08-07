const express = require('express');
const mysql = require('mysql2/promise');
const db = require('../db');
const sellerNumberRoute = express.Router();

sellerNumberRoute.get('/:email', async (req, res) => {
  const { email } = req.params;

  try {
    

    const [results] = await db.execute('SELECT phone FROM sellers WHERE user_id = ?', [email]);

    if (results.length > 0) {
      const phone = results[0].phone;
      res.status(200).json({ phone });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    console.error('Error executing SQL query: ', err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = sellerNumberRoute;