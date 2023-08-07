const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const mysql = require('mysql2/promise');
const db = require('./db');



const ideaRouter = express.Router();

ideaRouter.get('/', async (req, res) => {
  try {
    // Fetch data from the table
    const query = 'SELECT * FROM ideas';
    const [results] = await db.query(query);

    // Prepare the response object
    const response = {
      data: [],
    };

    for (const row of results) {
      const idea = { ...row };
      const ideaImagePath = path.join(__dirname, idea.idea_image_path);
    //   const documentPath = path.join(__dirname, idea.document_path);

      // Read and convert profile image to base64 string
      const ideaImage = await fs.readFile(ideaImagePath);
      const ideaBase64 = ideaImage.toString('base64');
      idea.idea_image_path = ideaBase64;

      // Read and convert document image to base64 string
    //   const documentImage = await fs.readFile(documentPath);
    //   const documentBase64 = documentImage.toString('base64');
    //   idea.document_path = documentBase64;

      response.data.push(idea);
    }

    res.json(response);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});


module.exports = ideaRouter;