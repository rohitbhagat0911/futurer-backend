const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../db');


const scraperUpdateRoute = express.Router();
const fs = require('fs'); // Import the 'fs' module to work with the file system

// Define the destination and filename for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/members/scrapers');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const fieldName = file.fieldname;
    cb(null, fieldName + '-' + uniqueSuffix + extension);
  },
});

// Create the multer middleware
const upload = multer({ storage });

scraperUpdateRoute.post('/updateScraperInfo', upload.fields([{ name: 'profileImage', maxCount: 1 }]), async (req, res) => {
  try {
    const { name, pinCode, mobile, address, onDeletion, workingArea, items, userId } = req.body;

    if (!name || !pinCode || !mobile || !address || !onDeletion || !workingArea || !items || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (onDeletion === true || onDeletion === 'true') {
      try {
        // Get the current profile_path from the database
        const getCurrentProfilePathQuery = "SELECT profile_path FROM scrapers WHERE user_id = ?";
        const getCurrentProfilePathValues = [userId];
        const [currentProfile] = await db.execute(getCurrentProfilePathQuery, getCurrentProfilePathValues);

        // Delete the existing file in 'profile_path' if it exists
        const currentProfilePath = currentProfile[0]?.profile_path;
        if (currentProfilePath) {
          try {
            fs.unlinkSync(currentProfilePath);
            console.log('Old profile image deleted:', currentProfilePath);
          } catch (error) {
            console.error('Error deleting old profile image:', error);
          }
        }

        // Get the new profile_path
        const profilePath = req.files['profileImage'] ? req.files['profileImage'][0].path : '';

        // Update the profile_path in the database
        const updateQuery = "UPDATE scrapers SET name = ?, profile_path = ?, pin_code = ?, phone = ?, address = ?, working_area = ?, list_of_items = ? WHERE user_id = ?";
        const updateValues = [name, profilePath, pinCode, mobile, address, workingArea, items, userId];
        await db.execute(updateQuery, updateValues);

        return res.status(200).json(null);

      } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'An error occurred' });
      }
    } else {
      try {
        const query = "UPDATE scrapers SET name = ?, pin_code = ?, phone = ?, address = ?,  working_area = ?, list_of_items = ? WHERE user_id = ?";
        const values = [name, pinCode, mobile, address, workingArea, items, userId];

        await db.execute(query, values);

        return res.status(200).json(null);

      } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'An error occurred' });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred' });
  }
});



module.exports = scraperUpdateRoute;