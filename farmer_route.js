const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const mysql = require('mysql2/promise');
const db = require('./db');



const farmerRouter = express.Router();

farmerRouter.get('/', async (req, res) => {
  try {
    // Fetch data from the table
    const query = 'SELECT * FROM farmers';
    const [results] = await db.query(query);

    // Prepare the response object
    const response = {
      data: [],
    };

    for (const row of results) {
      const farmer = { ...row };
      const profilePath = path.join(__dirname, farmer.profile_path);
      const documentPath = path.join(__dirname, farmer.document_path);

      // Read and convert profile image to base64 string
      const profileImage = await fs.readFile(profilePath);
      const profileBase64 = profileImage.toString('base64');
      farmer.profile_path = profileBase64;

      // Read and convert document image to base64 string
      const documentImage = await fs.readFile(documentPath);
      const documentBase64 = documentImage.toString('base64');
      farmer.document_path = documentBase64;

      response.data.push(farmer);
    }

    res.json(response);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});




// farmerRouter.get('/', async (req, res) => {
//   try {
   
//     const query = 'SELECT * FROM members WHERE members_level = 2';
//     const [results] = await db.query(query);

   
//     const response = {
//       data: results,
//       images: [],
//     };

//     const profileImagePaths = results.map((row) => row.profile_path);
//     const documentImagePaths = results.map((row) => row.document_path);

//     await Promise.all(
//       profileImagePaths.map(async (imagePath, index) => {
//         const imagePathFull = path.join(__dirname, imagePath);
//         const image = await fs.readFile(imagePathFull);
//         response.images.push({ profile: image.toString('base64') });
//       })
//     );

//     await Promise.all(
//       documentImagePaths.map(async (imagePath, index) => {
//         const imagePathFull = path.join(__dirname, imagePath);
//         const image = await fs.readFile(imagePathFull);
//         response.images[index].document = image.toString('base64');
//       })
//     );

//     res.json(response);
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     res.status(500).json({ error: 'Failed to fetch data' });
//   }
// });

module.exports = farmerRouter;
