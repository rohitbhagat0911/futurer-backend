const express = require('express');
const mysql = require('mysql2/promise');
const db = require('../db');
const currentCharities = express.Router();
const path = require('path');
const fs = require('fs').promises;

currentCharities.get('/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const [results] = await db.execute('SELECT * FROM charities WHERE user_id = ?', [email]);

    if (results.length > 0) {
      const charityData = results[0];
      const charity = { ...charityData };

      // Read and convert profile image to base64 string
      const profilePath = path.join(__dirname, '..',charity.profile_path);
      const profileImage = await fs.readFile(profilePath);
      const profileBase64 = profileImage.toString('base64');
      charity.profile_path = profileBase64;

      // Read and convert document image to base64 string
      const documentPath = path.join(__dirname , '..', charity.document_path);
      const documentImage = await fs.readFile(documentPath);
      const documentBase64 = documentImage.toString('base64');
      charity.document_path = documentBase64;

      res.status(200).json(charity);
    } else {
      res.status(200).json(null);
    }
  } catch (err) {
    console.error('Error executing SQL query: ', err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = currentCharities;



// const mysql = require('mysql2/promise');
// const db = require('../db');
// const currentcharity = express.Router();

// currentcharity.get('/:email', async (req, res) => {
//     const { email } = req.params;
  
//     try {
//       const [results] = await db.execute('SELECT * FROM charities WHERE user_id = ?', [email]);
  
//       if (results.length > 0) {
//         const charityData = results[0]; 
//         res.status(200).json(charityData);
//       } else {
//         res.status(200).json(null);
//       }
//     } catch (err) {
//       console.error('Error executing SQL query: ', err);
//       res.status(500).json({ error: 'An error occurred' });
//     }
//   });
  

// module.exports = currentcharity;

