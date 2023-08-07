const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('./db');

const regUser = express.Router();
  
  regUser.post('/newUser', async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
    
      const query = "INSERT INTO users (email, password, full_name) VALUES (?, ?, ?)";
      const values = [email, password, name];
  
      await db.execute(query, values);

    return res.status(200).json({ message: 'Data saved successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'An error occurred' });
    }
  });
  
  module.exports = regUser;

