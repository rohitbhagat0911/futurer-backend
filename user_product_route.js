const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const mysql = require('mysql2/promise');
const db = require('./db');


const userProductRouter = express.Router();


userProductRouter.get('/:email', async (req, res) => {
  const { email } = req.params;

  try {
    // Fetch data from the table
    const query = 'SELECT * FROM products WHERE user_id = ?';
    const [results] = await db.query(query, email);

    // Prepare the response object
    const response = {
      data: [],
    };

    for (const row of results) {
      const product = { ...row };
      const productImages = [];

      for (const image of JSON.parse(product.productImages)) {
        const productPath = path.join(__dirname, image.path);

        // Read and convert product images to base64 string
        const productImage = await fs.readFile(productPath, { encoding: 'base64' });
        productImages.push({
          data: productImage,
        });
      }

      product.productImages = productImages;
      response.data.push(product);
    }

    res.json(response);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});



// userProductRouter.get('/', async (req, res) => {
//     try {
//       // Fetch data from the table
//       const query = 'SELECT * FROM products';
//       const [results] = await db.query(query);
  
//       // Prepare the response object
//       const response = {
//         data: [],
//       };
  
//       for (const row of results) {
//         const product = { ...row };
//         const productPath = path.join(__dirname, product.productImages);
  
//         // Read and convert product images to base64 string
//         const productImages = await fs.readFile(productPath, { encoding: 'base64' });
//         product.productImages = productImages;
  
//         response.data.push(product);
//       }
  
//       res.json(response);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       res.status(500).json({ error: 'Failed to fetch data' });
//     }
//   });
  

module.exports = userProductRouter;
