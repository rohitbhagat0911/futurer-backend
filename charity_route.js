const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const mysql = require('mysql2/promise');
const db = require('./db');



const charityRouter = express.Router();

charityRouter.get('/', async (req, res) => {
  try {
    // Fetch data from the table
    const query = 'SELECT * FROM charities';
    const [results] = await db.query(query);

    // Prepare the response object
    const response = {
      data: [],
    };

    for (const row of results) {
      const charity = { ...row };
      const profilePath = path.join(__dirname, charity.profile_path);
      const documentPath = path.join(__dirname, charity.document_path);

      // Read and convert profile image to base64 string
      const profileImage = await fs.readFile(profilePath);
      const profileBase64 = profileImage.toString('base64');
      charity.profile_path = profileBase64;

      // Read and convert document image to base64 string
      const documentImage = await fs.readFile(documentPath);
      const documentBase64 = documentImage.toString('base64');
      charity.document_path = documentBase64;

      response.data.push(charity);
    }

    res.json(response);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

module.exports = charityRouter;
