const express = require('express');
const mysql = require('mysql2/promise');
const db = require('./db');
const tipsRoute = express.Router();

tipsRoute.get('/', async (req, res) => {
    function getRandomNumber(min, max) {
      const range = max - min;
      const random = Math.random();
      const randomNumberInRange = random * range + min;
      return Math.floor(randomNumberInRange);
    }
  
    try {
      const tips = [];
      
      for (let i = 0; i < 5; i++) {
        const id = getRandomNumber(1, 2645); 
        const [results] = await db.execute('SELECT tip_text FROM tips WHERE id = ?', [id]);
  
        if (results.length > 0) {
          tips.push(results[0].tip_text);
        }
      }
  
      if (tips.length > 0) {
        res.status(200).json({ tips });
      } else {
        res.status(404).json({ error: 'No tips found' });
      }
    } catch (err) {
      console.error('Error executing SQL query: ', err);
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  

module.exports = tipsRoute;
