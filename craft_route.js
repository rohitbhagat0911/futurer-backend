const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const mysql = require('mysql2/promise');
const db = require('./db');



const craftRouter = express.Router();

craftRouter.get('/', async (req, res) => {
  try {
    // Fetch data from the table
    const query = 'SELECT * FROM crafts';
    const [results] = await db.query(query);

    // Prepare the response object
    const response = {
      data: [],
    };

    for (const row of results) {
      const craft = { ...row };
      const craftImagePath = path.join(__dirname, craft.craft_image_path);
    //   const documentPath = path.join(__dirname, craft.document_path);

      // Read and convert profile image to base64 string
      const craftImage = await fs.readFile(craftImagePath);
      const craftBase64 = craftImage.toString('base64');
      craft.craft_image_path = craftBase64;

      // Read and convert document image to base64 string
    //   const documentImage = await fs.readFile(documentPath);
    //   const documentBase64 = documentImage.toString('base64');
    //   craft.document_path = documentBase64;

      response.data.push(craft);
    }

    res.json(response);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});


module.exports = craftRouter;