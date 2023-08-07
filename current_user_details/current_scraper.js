const express = require('express');
const mysql = require('mysql2/promise');
const db = require('../db');
const currentScraper = express.Router();
const path = require('path');
const fs = require('fs').promises;

currentScraper.get('/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const [results] = await db.execute('SELECT * FROM scrapers WHERE user_id = ?', [email]);

    if (results.length > 0) {
      const scraperData = results[0];
      const scraper = { ...scraperData };

      // Read and convert profile image to base64 string
      const profilePath = path.join(__dirname, '..',scraper.profile_path);
      const profileImage = await fs.readFile(profilePath);
      const profileBase64 = profileImage.toString('base64');
      scraper.profile_path = profileBase64;

      // Read and convert document image to base64 string
      const documentPath = path.join(__dirname , '..', scraper.document_path);
      const documentImage = await fs.readFile(documentPath);
      const documentBase64 = documentImage.toString('base64');
      scraper.document_path = documentBase64;

      res.status(200).json(scraper);
    } else {
      res.status(200).json(null);
    }
  } catch (err) {
    console.error('Error executing SQL query: ', err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = currentScraper;



// const mysql = require('mysql2/promise');
// const db = require('../db');
// const currentScraper = express.Router();

// currentScraper.get('/:email', async (req, res) => {
//     const { email } = req.params;
  
//     try {
//       const [results] = await db.execute('SELECT * FROM scrapers WHERE user_id = ?', [email]);
  
//       if (results.length > 0) {
//         const scraperData = results[0]; 
//         res.status(200).json(scraperData);
//       } else {
//         res.status(200).json(null);
//       }
//     } catch (err) {
//       console.error('Error executing SQL query: ', err);
//       res.status(500).json({ error: 'An error occurred' });
//     }
//   });
  

// module.exports = currentScraper;

