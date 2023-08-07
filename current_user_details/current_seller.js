const express = require('express');
const mysql = require('mysql2/promise');
const db = require('../db');
const currentSeller = express.Router();
const path = require('path');
const fs = require('fs').promises;

currentSeller.get('/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const [results] = await db.execute('SELECT * FROM sellers WHERE user_id = ?', [email]);

    if (results.length > 0) {
      const sellerData = results[0];
      const seller = { ...sellerData };

      // Read and convert profile image to base64 string
      const profilePath = path.join(__dirname, '..',seller.profile_path);
      const profileImage = await fs.readFile(profilePath);
      const profileBase64 = profileImage.toString('base64');
      seller.profile_path = profileBase64;

      // Read and convert document image to base64 string
      const documentPath = path.join(__dirname , '..', seller.document_path);
      const documentImage = await fs.readFile(documentPath);
      const documentBase64 = documentImage.toString('base64');
      seller.document_path = documentBase64;

      res.status(200).json(seller);
    } else {
      res.status(200).json(null);
    }
  } catch (err) {
    console.error('Error executing SQL query: ', err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = currentSeller;



// const mysql = require('mysql2/promise');
// const db = require('../db');
// const currentseller = express.Router();

// currentseller.get('/:email', async (req, res) => {
//     const { email } = req.params;
  
//     try {
//       const [results] = await db.execute('SELECT * FROM sellers WHERE user_id = ?', [email]);
  
//       if (results.length > 0) {
//         const sellerData = results[0]; 
//         res.status(200).json(sellerData);
//       } else {
//         res.status(200).json(null);
//       }
//     } catch (err) {
//       console.error('Error executing SQL query: ', err);
//       res.status(500).json({ error: 'An error occurred' });
//     }
//   });
  

// module.exports = currentseller;

