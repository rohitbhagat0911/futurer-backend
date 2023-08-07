const express = require('express');
const mysql = require('mysql2/promise');
const db = require('../db');
const currentFarmer = express.Router();
const path = require('path');
const fs = require('fs').promises;

currentFarmer.get('/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const [results] = await db.execute('SELECT * FROM farmers WHERE user_id = ?', [email]);

    if (results.length > 0) {
      const farmerData = results[0];
      const farmer = { ...farmerData };

      // Read and convert profile image to base64 string
      const profilePath = path.join(__dirname, '..',farmer.profile_path);
      const profileImage = await fs.readFile(profilePath);
      const profileBase64 = profileImage.toString('base64');
      farmer.profile_path = profileBase64;

      // Read and convert document image to base64 string
      const documentPath = path.join(__dirname , '..', farmer.document_path);
      const documentImage = await fs.readFile(documentPath);
      const documentBase64 = documentImage.toString('base64');
      farmer.document_path = documentBase64;

      res.status(200).json(farmer);
    } else {
      res.status(200).json(null);
    }
  } catch (err) {
    console.error('Error executing SQL query: ', err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = currentFarmer;



// const mysql = require('mysql2/promise');
// const db = require('../db');
// const currentFarmer = express.Router();

// currentFarmer.get('/:email', async (req, res) => {
//     const { email } = req.params;
  
//     try {
//       const [results] = await db.execute('SELECT * FROM farmers WHERE user_id = ?', [email]);
  
//       if (results.length > 0) {
//         const farmerData = results[0]; 
//         res.status(200).json(farmerData);
//       } else {
//         res.status(200).json(null);
//       }
//     } catch (err) {
//       console.error('Error executing SQL query: ', err);
//       res.status(500).json({ error: 'An error occurred' });
//     }
//   });
  

// module.exports = currentFarmer;

