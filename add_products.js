const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('./db');
const fs = require('fs/promises');
const addProduct = express.Router();
const { v4: uuidv4 } = require('uuid');


const storage = multer.diskStorage({
  destination: 'uploads/products',
  filename: (req, file, cb) => {
    const uniqueFilename = `${Date.now()}_${uuidv4()}_${file.originalname}`;
    cb(null, uniqueFilename);
  },
});

const upload = multer({ storage });

addProduct.post('/addProduct', upload.array('productImages', 10), async (req, res) => {
  const { id, title, price, description, userId } = req.body;
  const productImages = [];

  for (const file of req.files) {
    const uniqueFilename = `${Date.now()}_${uuidv4()}_${file.originalname}`;
    const newPath = path.join('uploads/products', uniqueFilename);

    // Rename the image file
    await fs.rename(file.path, newPath);

    productImages.push({
      path: newPath,
      // filename: uniqueFilename,
    });
  }

  try {
    // Construct the SQL query to insert the product data into the database
    const query = 'INSERT INTO products (title, price, description, productImages, user_id) VALUES (?, ?, ?, ?, ?)';
    const values = [title, price, description, JSON.stringify(productImages), userId];

    // Execute the SQL query using promises
    const [results] = await db.query(query, values);

    console.log('Product data stored successfully');
    res.status(200).send('Product data received');
  } catch (error) {
    console.error('Failed to store product data:', error);
    res.status(500).send('Failed to store product data');
  }
});

// const storage = multer.diskStorage({
//   destination: 'uploads/products',
//   filename: (req, file, cb) => {
//     const uniqueFilename = `${Date.now()}_${file.originalname}`;
//     cb(null, uniqueFilename);
//   },
//   fileFilter: (req, file, cb) => {
//     // Validate file type here if needed
//     cb(null, true);
//   },
// });

// const upload = multer({ storage });

// addProduct.post('/addProduct', upload.array('productImages', 10), async (req, res) => {
//   const { id, title, price, description } = req.body;
//   const productImages = req.files.map(file => {
//     const uniqueFilename = `${Date.now()}_${uuidv4()}_${file.originalname}`;
//     return {
//       path: file.path,
//       // filename: uniqueFilename,
//     };
//   });

//   try {
//     // Construct the SQL query to insert the product data into the database
//     const query = 'INSERT INTO products (title, price, description, productImages) VALUES (?, ?, ?, ?)';
//     const values = [title, price, description, JSON.stringify(productImages)];

//     // Execute the SQL query using promises
//     const [results] = await db.query(query, values);

//     console.log('Product data stored successfully');
//     res.status(200).send('Product data received');
//   } catch (error) {
//     console.error('Failed to store product data:', error);
//     res.status(500).send('Failed to store product data');
//   }
// });

// module.exports = addProduct;


module.exports =  addProduct ;





// const { v4: uuidv4 } = require('uuid');

// async function addProduct(req, res) {
//   const { id, title, price, description } = req.body;
//   const productImages = req.files.map(file => {
//     const uniqueFilename = `${Date.now()}_${uuidv4()}_${file.originalname}`;
//     return {
//       path: file.path,
//       filename: uniqueFilename,
//     };
//   });

//   try {
//     // Construct the SQL query to insert the product data into the database
//     const query = 'INSERT INTO products (title, price, description, productImages) VALUES (?, ?, ?, ?)';
//     const values = [title, price, description, JSON.stringify(productImages)];

//     // Execute the SQL query using promises
//     const [results] = await db.query(query, values);

//     console.log('Product data stored successfully');
//     res.status(200).send('Product data received');
//   } catch (error) {
//     console.error('Failed to store product data:', error);
//     res.status(500).send('Failed to store product data');
//   }
// }