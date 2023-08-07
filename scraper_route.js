const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const mysql = require('mysql2/promise');
const db = require('./db');



const scraperRouter = express.Router();

scraperRouter.get('/', async (req, res) => {
  try {
    // Fetch data from the table
    const query = 'SELECT * FROM scrapers';
    const [results] = await db.query(query);

    // Prepare the response object
    const response = {
      data: [],
    };

    for (const row of results) {
      const scraper = { ...row };
      const profilePath = path.join(__dirname, scraper.profile_path);
      const documentPath = path.join(__dirname, scraper.document_path);

      // Read and convert profile image to base64 string
      const profileImage = await fs.readFile(profilePath);
      const profileBase64 = profileImage.toString('base64');
      scraper.profile_path = profileBase64;

      // Read and convert document image to base64 string
      const documentImage = await fs.readFile(documentPath);
      const documentBase64 = documentImage.toString('base64');
      scraper.document_path = documentBase64;

      response.data.push(scraper);
    }

    res.json(response);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});


module.exports = scraperRouter;
