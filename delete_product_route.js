const express = require('express');
const path = require('path');
// const fsPromise = require('fs/promises');
const mysql = require('mysql2/promise');
const db = require('./db');

const deleteProductRouter = express.Router();
const fs = require('fs');


deleteProductRouter.post('/userProductDelete', async (req, res) => {
  const { title, price, userId } = req.body;
  console.log(title);
  console.log(price);
  console.log(userId);

  try {
    // Get the current productImages path from the database
    const query = 'SELECT productImages FROM products WHERE title=? AND price=? AND user_id=?';
    const [rows] = await db.execute(query, [title, price, userId]);

    if (rows.length > 0) {
      const productImageArray = JSON.parse(rows[0].productImages); // Parse the JSON string to get an array

      if (Array.isArray(productImageArray)) {
        // Delete each image from the file system
        productImageArray.forEach((image) => {
          try {
            fs.unlinkSync(image.path);
            console.log('Image deleted:', image.path);
          } catch (error) {
            console.error('Error deleting image:', error);
          }
        });
      }
    }

    // Delete data from the table
    const deleteQuery = 'DELETE FROM products WHERE title=? AND price=? AND user_id=?';
    await db.execute(deleteQuery, [title, price, userId]);

    // Prepare the response object
    return res.status(200).json({ message: 'Data deleted successfully' });
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ error: 'Failed to delete data' });
  }
});






// const deleteProductRouter = express.Router();

// deleteProductRouter.post('/userProductDelete', async (req, res) => {
//   const { title, price, userId } = req.body;
//   console.log(title);
//   console.log(price);
//   console.log(userId);

//   try {
//     // Delete data from the table
//     const query = 'DELETE FROM products WHERE title=? AND price=? AND user_id=?';
//     await db.execute(query, [title, price, userId]);

//     // Prepare the response object
//     return res.status(200).json({ message: 'Data deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting data:', error);
//     res.status(500).json({ error: 'Failed to delete data' });
//   }
// });


  
module.exports = deleteProductRouter;
